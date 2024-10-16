---
title: "Simple Master Slave 👍"
sidebar_position: 1
---


This project demonstrates the use of the Modbus protocol for communication between two ESP32 devices configured in a Master-Slave architecture. Using two ESP32 modules and a DHT22 sensor 🌡️ to measure temperature and humidity, the data from the Slave device is transmitted to the Master device via an RS485 connection 🔗.

The project allows the ESP32 modules to communicate over distances of up to 1 kilometer 🛤️, thanks to the TTL to RS485 converters 🔌, which provide reliable communication over a serial interface. The Master device collects data from the DHT22 sensor connected to the Slave device using the Modbus protocol.


## Required Components: 📦

- 2 ESP32 modules 🧩
- 1 DHT22 sensor 🌡️
- 2 TTL to RS485 modules 🔌

:::tip
This setup creates a flexible and long-range solution for transferring sensor data over a Modbus communication network 📡.
:::

### Master Node

```yaml title="master_node.yaml" showLineNumbers
esphome:
  name: modbus_slave

esp32:
  board: esp32-poe
  framework:
    type: arduino

logger:
  baud_rate: 0

wifi:
  ssid: "Office"
  password: ""

# Optional: Web server for diagnostics and control
web_server:
  port: 80

api:
  encryption:
    key: "xzk+JFc7tYbRshh0XwnB/cYwCoIog7/gxSNumfTcQBQ="

ota:
  platform: esphome
  password: "3d5c5052c31f75730cfa5d4e4e79435b"

sensor:
  - platform: dht
    pin: 3
    model: DHT22
    temperature:
      name: "DHT22 Temperature"
      id: dht22_temperature
    humidity:
      name: "DHT22 Humidity"
      id: dht22_humidity
    update_interval: 1s



# Configure the UART for Modbus
uart:
  id: uart_1
  tx_pin: 4
  rx_pin: 36
  baud_rate: 9600

# Configure the Modbus component as a server
modbus:
  uart_id: uart_1
  id: modbus_1
  role: server

# Modbus controller configuration for the server
modbus_controller:
  - id: modbus_server
    modbus_id: modbus_1
    address: 0x01
    server_registers:

      - address: 0x0001
        value_type: FP32
        read_lambda: |-
          return id(dht22_temperature).state;

      - address: 0x0002
        value_type: FP32
        read_lambda: |-
          return id(dht22_humidity).state;
```

### Slave Node

```yaml title="slave_node.yaml" showLineNumbers
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
  id: uart_1
  tx_pin: 4
  rx_pin: 36
  baud_rate: 9600

# Configure the Modbus component as a server
modbus:
  uart_id: uart_1
  id: modbus_1



modbus_controller:
  - id: modbus_slave
    modbus_id: modbus_1
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
