---
sidebar_position: 4
title: 💻 Програмиране 
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



#### Клапани:

Системата включва набор от клапани, които контролират потока на водата между водопровода, резервоара, помпата и сградата. Клапаните се активират и деактивират в зависимост от текущия режим на работа.

|    |               Клапан                        | ID                           |
|----|----------------------------------------------|------------------------------|
| 1  | водоснабдяване към резервоара         | `valve_supply_to_tank`       |
| 2  | сондаж към резервоара                 | `valve_spring_to_tank`       |
| 3  | помпа към резервоара                  | `valve_pump_to_tank`         |
| 4  | водоснабдяване към помпата            | `valve_supply_to_pump`       |
| 5  | сондаж към помпата                    | `valve_spring_to_pump`       |
| 6  | резервоар към помпата                 | `valve_tank_to_pump`         |
| 7  | помпа към сградата                    | `valve_pump_to_building`     |


#### Сензори:

Системата разполага с различни сензори, които следят ключови параметри като нивото на водата в резервоара, налягането във водопровода и потреблението на вода в сградата. Тези сензори осигуряват обратна връзка към системата, позволявайки ѝ автоматично да променя режимите на работа според моментната ситуация, с цел оптимизация и надеждност на водоснабдяването.

|    | Сензор                                     | ID                           |
|----|----------------------------------------------|------------------------------|
| 1  | високо ниво в резервоара           | `tank_high_level`            |
| 2  |ниско ниво в резервоара            | `tank_low_level`             |
| 3  | налягане във водопровода (ВиК)     | `water_supply_available`     |
| 4  |консумация на вода в сградата      | `building_water_consumption` |


---