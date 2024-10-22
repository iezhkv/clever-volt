---
sidebar_position: 5
title: Програмиране
---



```yaml title="configuration.yaml"
esphome:
  name: modbus_master



esp32:
  board: esp32-poe
  framework:
    type: arduino


# Enable logging
logger:
  baud_rate: 0


wifi:
  ssid: "Office"
  password: ""

# Optional: Web server for diagnostics and control
web_server:
  port: 80


# Enable Home Assistant API
api:
  encryption:
    key: "xzk+JFc7tYbRshh0XwnB/cYwCoIog7/gxSNumfTcQBQ="

# Enable OTA updates
ota:
  platform: esphome
  password: "3d5c5052c31f75730cfa5d4e4e79435b"




# Configure the UART for Modbus
uart:
  id: uart_modbus_client
  tx_pin: 4
  rx_pin: 36
  baud_rate: 9600

# Configure the Modbus component as a server
modbus:
  uart_id: uart_modbus_client
  id: modbus_client



modbus_controller:
  - id: modbus_slave
    modbus_id: modbus_client
    address: 0x1
    update_interval: 1s

sensor:
  - platform: modbus_controller
    modbus_controller_id: modbus_slave
    name: "Slave DHT22 Temperature"
    register_type: holding
    address: 0x0001
    value_type: FP32
    unit_of_measurement: "°C"

# Read humidity from Modbus slave
  - platform: modbus_controller
    modbus_controller_id: modbus_slave
    name: "Slave DHT22 Humidity"
    register_type: holding
    address: 0x0002
    value_type: FP32
    unit_of_measurement: "%"




```