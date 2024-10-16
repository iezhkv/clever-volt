---
sidebar_position: 3
title: ESPHome configuration
---

```yaml title="configuration.yaml"
esphome:
  name: pool-poe
  friendly_name: Pool-POE

esp32:
  board: esp32-poe
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "9Jhac+vn8RrV5EQvqAGb5lrF8wRGphwfukShf9nDOmI="

ota:
  password: "a53105430bb0b5195aa112dbaa28c82b"

ethernet:
  type: LAN8720
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  clk_mode: GPIO17_OUT
  phy_addr: 0
  power_pin: GPIO12
  
  manual_ip:
    static_ip: 192.168.0.88
    gateway: 192.168.0.1
    subnet: 255.255.255.0
    
web_server:
  port: 80
  auth:
    username: !secret web_server_username
    password: !secret web_server_password

i2c:
  sda: 13
  scl: 16
  scan: True
  id: bus_a

dallas:
  - pin: 32
    update_interval: 3s


binary_sensor:
  - platform: status
    name: "Pool Status"

sensor:

  - platform: uptime
    name: "Pool Uptime"
    id: "pool_uptime"


  - platform: dallas
    address: 0x473c01d075cc8328
    name: "Big Pool"
    id: "big_pool_temp"
    resolution: 12
    unit_of_measurement: "°C"
    icon: "mdi:coolant-temperature"
    device_class: "temperature"
    state_class: "measurement"
    accuracy_decimals: 2
    force_update: true
    filters:
      - filter_out: -127.00
      - filter_out: 127.00
      - median:
          window_size: 10
          send_every: 6
          send_first_at: 5
      - calibrate_linear:
        - 3.8 -> 5.6
        - 27.0 -> 28.4
        - 58.4 -> 59.1
        - 108.0 -> 110.3
      
  - platform: dallas
    address: 0x643c01d075c5ed28
    name: "Small Pool"
    id: "small_pool_temp"
    resolution: 12
    unit_of_measurement: "°C"
    icon: "mdi:coolant-temperature"
    device_class: "temperature"
    state_class: "measurement"
    accuracy_decimals: 2
    force_update: true
    filters:
      - filter_out: -127.00
      - filter_out: 127.00
      - median:
          window_size: 10
          send_every: 6
          send_first_at: 5
      - calibrate_linear:
        - 5.1 -> 5.6
        - 28.2 -> 28.4
        - 58.5 -> 59.1
        - 111.7 -> 110.3
        
output:
  - id: relay_led_lights
    platform: gpio
    pin: 33
    inverted: true

light:
  - platform: binary
    name: "Pool Lights"
    id: pool_lights
    output: relay_led_lights


```