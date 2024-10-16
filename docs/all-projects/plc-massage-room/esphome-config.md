---
sidebar_position: 3
title: "ESPHome configuration 🛠️"
---

```yaml title="configuration.yaml"
substitutions:
  name: "plc-massage-room"
  friendly_name: "PLC Massage Room"


globals:
  - id: bed_lifting_time
    type: int
    initial_value: '45'  # Default lifting time in seconds
  - id: bed_lowering_time
    type: int
    initial_value: '40'  # Default lowering time in seconds

  - id: last_heat_after_massage_execution
    type: uint32_t
    initial_value: '0'

  - id: halogenerator_active
    type: bool
    initial_value: 'false'


esphome:
  name: "${name}"
  friendly_name: "${friendly_name}"


esp32:
  board: esp32-poe
  framework:
    type: arduino


logger:


api:
  encryption:
    key: "xzk+JFc7tYbRshh0XwnB/cYwCoIog7/gxSNumfTcQBQ="

ota:
  password: "3d5c5052c31f75730cfa5d4e4e79435b"

ethernet:
  type: LAN8720
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  clk_mode: GPIO17_OUT
  phy_addr: 0
  power_pin: GPIO12
    
  manual_ip:
    static_ip: 192.168.20.130
    gateway: 192.168.20.1
    subnet: 255.255.255.0

web_server:
  port: 80


##  COMMUNICATION PROTOCOLS
uart:
  tx_pin: 4
  rx_pin: 36
  baud_rate: 9600

i2c:
  sda: 13
  scl: 16
  scan: True
  id: bus_a

spi:
  clk_pin: 14
  mosi_pin: 2
  miso_pin: 15
  ## pin 5 is for slave select



## GOLOBAL HUBS
pcf8574:

  - id: 'pcf'
    address: 0x21
    pcf8575: true

dallas:
  - pin: 3
    update_interval: 5s


##  BUTTONS
button:
  - platform: restart
    name: "${name} Restart"

  - platform: template ## Halogenerator switchbot
    name: "Halogenerator Button"
    id: halogenerator_button
    on_press:
      then:
        - logger.log: "Halo button has benn pressed"
        - servo.write:
            id: but
            level: 80.0%
        - delay: 0.3s
        - servo.write:
            id: but
            level: 50.0%

  - platform: template ## Heat after massage automation
    name: "Heat after massage"
    id: heat_after_massage_button
    on_press:
      then:
        - script.execute: handle_heat_action


##  SWITCHES
switch:

  - platform: template
    name: "Halogenerator Switch"
    id: halogenerator_switch
    optimistic: true
    turn_on_action:
      - globals.set:
          id: halogenerator_active
          value: 'true'
      - script.execute: press_my_button_repeatedly
    turn_off_action:
      - globals.set:
          id: halogenerator_active
          value: 'false'




  - platform: gpio
    id: "bed_lift"
    name: Bed Lift
    pin:
      pcf8574: pcf
      number: 8
      mode:
        output: true
      inverted: true
    on_turn_on:
      - switch.turn_off: bed_lower

  - platform: gpio
    id: "bed_lower"
    name: Bed Lower
    pin:
      pcf8574: pcf
      number: 9
      mode:
        output: true
      inverted: true
    on_turn_on:
      - switch.turn_off: bed_lift

    

  - platform: gpio
    id: "bed_restore"
    name: Bed Restore
    pin:
      pcf8574: pcf
      number: 10
      mode:
        output: true
      inverted: true
    

##  OUTPUTS 
output:

  - platform: ledc
    pin: 32
    id: pwm_1


  - id: r_1
    platform: gpio
    pin:
      pcf8574: pcf
      number: 3
      mode:
        output: true
      inverted: true

  - id: r_2
    platform: gpio
    pin:
      pcf8574: pcf
      number: 4
      mode:
        output: true
      inverted: true

  - id: r_3
    platform: gpio
    pin:
      pcf8574: pcf
      number: 5
      mode:
        output: true
      inverted: true


##  LIGHTS
light:

  - platform: binary
    name: "Massage Room Main"
    id: massage_room_main
    output: r_1
    restore_mode: RESTORE_DEFAULT_OFF

  - platform: binary
    name: "Massage Room Secondary"
    id: massage_room_secondary
    output: r_2
    restore_mode: RESTORE_DEFAULT_OFF


  - platform: binary
    name: "Massage Room IR Heater"
    id: massage_room_ir_heater
    output: r_3
    restore_mode: RESTORE_DEFAULT_OFF

          
##  BINARY SENSORS
binary_sensor:

  - platform: gpio ## WALL SWITCH 1
    pin:
      pcf8574: pcf
      number: 1
      mode:
        input: true
    id: sw_2
    name: Wall Switch 1
    internal: true
    filters:
      - invert:
    on_multi_click:
    - timing:
        - ON for at most 0.5s
        - OFF for at most 0.5s
        - ON for at most 0.5s
        - OFF for at least 0.2s
      invalid_cooldown: 0.5s
      then:
        - logger.log: "Switch 1 Double Clicked"
        - script.execute: handle_heat_action

    - timing:
        - ON for 0.7s to 5s
        - OFF for at least 0.5s
      invalid_cooldown: 0.5s
      then:
        - logger.log: "Switch 1 Single Long Clicked"
        - button.press: halogenerator_button

    - timing:
        - ON for at most 0.5s
        - OFF for at least 0.5s
      invalid_cooldown: 0.5s
      then:
        - logger.log: "Switch 1 Single Short Clicked"
        - light.toggle: massage_room_main

  - platform: gpio ## WALL SWITCH 2
    pin:
      pcf8574: pcf
      number: 0
      mode:
        input: true
    id: sw_1
    name: Wall Switch 2
    internal: true
    on_press:
      then:
        - logger.log: "Switch 2 Single Short Clicked"
        - light.toggle:
            id: massage_room_secondary


##  TEXT SENSORS 
text_sensor:
  - platform: ethernet_info
    ip_address:
      name: "IP Address"
  - platform: version
    name: "ESPHome Version"
  

## GENERAL SENSORS
    ## TODO: Define ds18b20 sensors

##  NUMBERS
number:
  - platform: template ## Heater Duration
    id: heater_duration
    name: "Heater Duration"
    mode: slider
    unit_of_measurement: "m"
    optimistic: true
    restore_value: true
    min_value: 3
    max_value: 15
    step: 1


## MOTORS
servo:
  - id: but
    output: pwm_1
    min_level: 50%
    max_level: 90%


##  SCRIPTS

script:

  - id: heat_after_massage
    then:
      ## 1 Start lifting bed
      - script.execute: lift_bed

      ## 2 Turn ON the heater
      - light.turn_on: massage_room_ir_heater
      - delay: 1s

      ## 3 Turn OFF the lights
      - light.turn_off: massage_room_main
      - light.turn_off: massage_room_secondary

      ## 4 Keep the heater on for the desired time - bed lowering time
      - delay: !lambda |-
          // 4.1 Convert heater duration from minutes to milliseconds
          int duration_milliseconds = id(heater_duration).state * 60000;

          // 4.2 Convert bed lowering time from seconds to milliseconds
          int bed_lowering_milliseconds = id(bed_lowering_time) * 1000;

          // 4.3 Calculate adjusted heating duration by subtracting bed lowering time
          int adjusted_heating_time = duration_milliseconds - bed_lowering_milliseconds;

          // 4.4 Ensure the heating time does not become negative
          if (adjusted_heating_time < 0) {
              adjusted_heating_time = 0;
          }

          return adjusted_heating_time;

      ## 5 Start lowering the bed
      - script.execute: lower_bed

      ## 6 Wait for bed to reach lowes possition
      - delay: !lambda |-
          return id(bed_lowering_time) * 1000;  

      ## 7 Turn on the lights as soon as bed is low
      - light.turn_on: massage_room_main
      - light.turn_on: massage_room_secondary

      ## 8 Turn OFF the heater
      - light.turn_off: massage_room_ir_heater

      ## 9 Restore bed
      - script.execute: restore_bed

      ## 10 Remember last execution of the script so that we can lock it for 2 minutes
      - lambda: |-
          id(last_heat_after_massage_execution) = millis();


  - id: force_stop_heat_after_massage
    then:
      ## 1 Stop the script
      - script.stop: heat_after_massage

      ## 2 Start lowering the bed
      - script.execute: lower_bed

      ## 3 Turn ON the lights
      - light.turn_on: massage_room_main
      - light.turn_on: massage_room_secondary

      ## Turn OFF the heater
      - light.turn_off: massage_room_ir_heater




  - id: handle_heat_action
    mode: restart
    then:
      ## Check if heat_after_massage is running
      - if:
          condition:
            script.is_running: heat_after_massage
          then:
            ##If heat_after_massage is running, execute force_stop_heat_after_massage
            - script.execute: force_stop_heat_after_massage
          else:
            ## Check if the last execution of heat_after_massage is not less than 2 minutes
            - lambda: |-
                auto now = millis();
                // Check if at least 2 minutes (120000 milliseconds) have passed since last execution
                if ((now - id(last_heat_after_massage_execution)) < 120000) {
                  // If less than 2 minutes, log an error
                  ESP_LOGE("custom", "Less than 2 minutes since last execution. Please wait.");
                } else {
                  // If more than 2 minutes have passed, proceed to execute heat_after_massage
                  id(heat_after_massage).execute();
                }

  - id: lift_bed 
    mode: restart
    then:
      - script.stop: lower_bed
      - switch.turn_on: bed_lift
      - delay: !lambda |-
          return id(bed_lifting_time) * 1000;
      - switch.turn_off: bed_lift



  - id: lower_bed 
    mode: restart
    then:
      - script.stop: lift_bed
      - switch.turn_on: bed_lower
      - delay: !lambda |-
          return id(bed_lowering_time) * 1000;
      - delay: 120s
      - switch.turn_off: bed_lower


  - id: restore_bed 
    mode: restart
    then:
      - delay: 10s
      - switch.turn_on: bed_restore
      - delay: 120s
      - switch.turn_off: bed_restore




  - id: press_my_button_repeatedly ## Press halo
    mode: restart
    then:
      - if:
          condition:
            lambda: 'return id(halogenerator_active);'
          then:
            - button.press: halogenerator_button
            - delay: 10sec # Use a shorter delay if necessary to prevent watchdog issues
            - script.execute: press_my_button_repeatedly
```