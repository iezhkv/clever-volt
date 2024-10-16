---
sidebar_position: 3
title: ESPHome configuration
---

```yaml title="configuration.yaml"

esphome:
  name: spa-lights-48ch
  friendly_name: Spa Lights 48ch

esp32:
  board: esp32-poe
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "mysuperstrongkey="

ota:
  password: "mysuperstrongkey"

ethernet:
  type: LAN8720
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  clk_mode: GPIO17_OUT
  phy_addr: 0
  power_pin: GPIO12
  
    
web_server:
  port: 80

i2c:
  sda: 13
  scl: 16
  scan: True
  id: bus_a

pcf8574:
  - id: 'one'
    address: 0x22
    pcf8575: true

  - id: 'two'
    address: 0x20
    pcf8575: true


switch:
  - platform: restart
    name: "Restart"

## OUTPUTS ##


output:

  ## ONE ##
  - id: relay_0
    platform: gpio
    pin:
      pcf8574: one
      number: 0
      mode:
        output: true
      inverted: true

  - id: relay_1
    platform: gpio
    pin:
      pcf8574: one
      number: 1
      mode:
        output: true
      inverted: true

  - id: relay_2
    platform: gpio
    pin:
      pcf8574: one
      number: 2
      mode:
        output: true
      inverted: true

  - id: relay_3
    platform: gpio
    pin:
      pcf8574: one
      number: 3
      mode:
        output: true
      inverted: true

  - id: relay_4
    platform: gpio
    pin:
      pcf8574: one
      number: 4
      mode:
        output: true
      inverted: true

  - id: relay_5
    platform: gpio
    pin:
      pcf8574: one
      number: 5
      mode:
        output: true
      inverted: true

  - id: relay_6
    platform: gpio
    pin:
      pcf8574: one
      number: 6
      mode:
        output: true
      inverted: true

  - id: relay_7
    platform: gpio
    pin:
      pcf8574: one
      number: 7
      mode:
        output: true
      inverted: true

  - id: relay_8
    platform: gpio
    pin:
      pcf8574: one
      number: 8
      mode:
        output: true
      inverted: true

  - id: relay_9
    platform: gpio
    pin:
      pcf8574: one
      number: 9
      mode:
        output: true
      inverted: true

  - id: relay_10
    platform: gpio
    pin:
      pcf8574: one
      number: 10
      mode:
        output: true
      inverted: true

  - id: relay_11
    platform: gpio
    pin:
      pcf8574: one
      number: 11
      mode:
        output: true
      inverted: true

  - id: relay_12
    platform: gpio
    pin:
      pcf8574: one
      number: 12
      mode:
        output: true
      inverted: true

  - id: relay_13
    platform: gpio
    pin:
      pcf8574: one
      number: 13
      mode:
        output: true
      inverted: true

  - id: relay_14
    platform: gpio
    pin:
      pcf8574: one
      number: 14
      mode:
        output: true
      inverted: true

  - id: relay_15
    platform: gpio
    pin:
      pcf8574: one
      number: 15
      mode:
        output: true
      inverted: true

 ## TWO ##
  - id: relay_16
    platform: gpio
    pin:
      pcf8574: two
      number: 0
      mode:
        output: true
      inverted: true

  - id: relay_17
    platform: gpio
    pin:
      pcf8574: two
      number: 1
      mode:
        output: true
      inverted: true

  - id: relay_18
    platform: gpio
    pin:
      pcf8574: two
      number: 2
      mode:
        output: true
      inverted: true

  - id: relay_19
    platform: gpio
    pin:
      pcf8574: two
      number: 3
      mode:
        output: true
      inverted: true

  - id: relay_20
    platform: gpio
    pin:
      pcf8574: two
      number: 4
      mode:
        output: true
      inverted: true

  - id: relay_21
    platform: gpio
    pin:
      pcf8574: two
      number: 5
      mode:
        output: true
      inverted: true

  - id: relay_22
    platform: gpio
    pin:
      pcf8574: two
      number: 6
      mode:
        output: true
      inverted: true

  - id: relay_23
    platform: gpio
    pin:
      pcf8574: two
      number: 7
      mode:
        output: true
      inverted: true

  - id: relay_24
    platform: gpio
    pin:
      pcf8574: two
      number: 8
      mode:
        output: true
      inverted: true

  - id: relay_25
    platform: gpio
    pin:
      pcf8574: two
      number: 9
      mode:
        output: true
      inverted: true

  - id: relay_26
    platform: gpio
    pin:
      pcf8574: two
      number: 10
      mode:
        output: true
      inverted: true

  - id: relay_27
    platform: gpio
    pin:
      pcf8574: two
      number: 11
      mode:
        output: true
      inverted: true

  - id: relay_28
    platform: gpio
    pin:
      pcf8574: two
      number: 12
      mode:
        output: true
      inverted: true

  - id: relay_29
    platform: gpio
    pin:
      pcf8574: two
      number: 13
      mode:
        output: true
      inverted: true

  - id: relay_30
    platform: gpio
    pin:
      pcf8574: two
      number: 14
      mode:
        output: true
      inverted: true

  - id: relay_31
    platform: gpio
    pin:
      pcf8574: two
      number: 15
      mode:
        output: true
      inverted: true

## LIGHTS ##
  

## ONE ##
light:
  - platform: binary
    name: "Office"
    id: "office"
    output: relay_0
    restore_mode: RESTORE_DEFAULT_ON

  - platform: binary
    name: "Lobby Bar Back"
    id: "lobby_bar_back"
    output: relay_1
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool 2"
    id: "pool_2"
    output: relay_2
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Relax Zone Led"
    id: "relax_zone_led"
    output: relay_3
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby 1"
    id: "lobby_1"
    output: relay_4
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "SPA Hallway"
    id: "spa_hallway"
    output: relay_5
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Reception Chandelier"
    id: "reception_chandelier"
    output: relay_6
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool Wall"
    id: "pool_wall"
    output: relay_7
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool Relax Walls"
    id: "pool_relax_walls"
    output: relay_8
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Reception Reserve"
    id: "reception_reserve"
    output: relay_9
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "SPA Celling"
    id: "spa_celling"
    output: relay_10
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby 2"
    id: "lobby_2"
    output: relay_11
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Relax Zone"
    id: "relax_zone"
    output: relay_12
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool 1"
    id: "pool_1"
    output: relay_13
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby Bar Section"
    id: "lobby_bar_section"
    output: relay_14
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Vestibule"
    id: "vestibule"
    output: relay_15
    restore_mode: RESTORE_DEFAULT_ON


## TWO ##

  - platform: binary
    name: "Finnish Sauna"
    id: "finnish_sauna"
    output: relay_16
    restore_mode: RESTORE_DEFAULT_ON

  - platform: binary
    name: "Lobby Walls"
    id: "lobby_walls"
    output: relay_17
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Herbal Sauna"
    id: "herbal_sauna"
    output: relay_18
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Steam Bath"
    id: "steam_bath"
    output: relay_19
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby Celling"
    id: "lobby_celling"
    output: relay_20
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool Relax"
    id: "pool_relax"
    output: relay_21
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Vestibule Led"
    id: "vestibule_led"
    output: relay_22
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Changing room"
    id: "changing_room"
    output: "relay_23"
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Empty 2"
    output: "relay_24"
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Facade Lightning"
    id: "facade_lightning"
    output: "relay_25"
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Pool Wall 2"
    id: "pool_wall_2"
    output: relay_26
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby Bar Counter"
    id: "lobby_bar_counter"
    output: relay_27
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Salt Steam Bath"
    id: "salt_steam_bath"
    output: relay_28
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "IR Sauna"
    id: "ir_sauna"
    output: relay_29
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Lobby Sofas"
    id: "lobby_sofas"
    output: relay_30
    restore_mode: RESTORE_DEFAULT_ON
    
  - platform: binary
    name: "Salt Room"
    id: "salt_room"
    output: relay_31
    restore_mode: RESTORE_DEFAULT_ON

```