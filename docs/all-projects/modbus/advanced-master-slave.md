---

title: "Advanced Master Slave 🚀"
sidebar_position: 2


---

This project demonstrates how two ESP32 devices communicate using the Modbus protocol, where one is a Master node, and the other is a Slave node. The Master controls a climate system (heating/cooling) based on the temperature data provided by the Slave. Additionally, the Slave displays the temperature on a screen and allows user interaction through buttons to modulate the thermostat.

:::note

In this setup, we are using an **external library** because ESPHome does not support writing to a Modbus slave out of the box. The library we are using is the **esphome-modbus-server** developed by Epic Labs. This allows the slave to both read and write Modbus registers, enabling more advanced communication with the master device.

You can find the library here: [esphome-modbus-server](https://github.com/epiclabs-uc/esphome-modbus-server).

:::

## Required Components: 📦

- 2 ESP32 boards (e.g., ESP32-POE)
- 1 SHT3x-D temperature and humidity sensor 🌡️
- 1 TM1637 display 📟
- 2 TTL to RS485 modules 🔌
- 3 Push buttons 🕹️


## Master Node Functionality

The **Master Node** is responsible for the following:

1. **Receiving Temperature Data:** The master receives temperature readings from the Slave via Modbus.

2. **Controlling the Climate System:** Based on the received temperature, the master controls the heating and cooling system through relays.

3. **Thermostat Modulation:** The thermostat's target temperature is updated by the slave, which is modulated using the buttons on the slave side.

5. **Modbus Communication:** The master node handles all Modbus transactions with the slave, fetching temperature data and controlling thermostat settings.

### Master Node YAML Configuration:
```yaml title="master_node.yaml" showLineNumbers
esphome:
  name: esp-poe-prototype-2
  friendly_name: ESP POE Prototype 2

esp32:
  board: esp32-poe
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "TBhOPb3cdw/qYvtPNMyKSEbCzTndys50sCuzWvcJtvY="

ota:
  - platform: esphome
    password: "fb39b717418246ea162532314bca89cf"

wifi:
  ssid: Bozhe Ime
  password: "0897923140"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Esp-Poe-Prototype"
    password: "QujZYANull7b"

captive_portal:


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
  - id: modbus_slave_1
    modbus_id: modbus_1
    address: 0x1
    update_interval: 5s


number:
  - platform: modbus_controller
    modbus_controller_id: modbus_slave_1
    id: num1
    name: "num1"
    address: 0x9001
    value_type: U_WORD
    multiply: 1.0
    min_value: 15
    max_value: 30
    step: 1


sensor:
  - platform: modbus_controller
    modbus_controller_id: modbus_slave_1
    address: 0x9002
    name: "Temp"
    id: temp
    accuracy_decimals: 2
    register_type: holding
    value_type: U_WORD
    filters:
      - timeout: 10s  # sent value will be NaN




switch:
  - platform: gpio
    pin: 1
    id: heater
    name: "Heater"

  - platform: gpio
    pin: 2
    id: air_cond
    name: "Heater"




climate:
  - platform: thermostat
    name: "Thermostat Climate Controller"
    id: therm
    sensor: temp
    min_cooling_off_time: 0s
    min_cooling_run_time: 0s
    min_heating_off_time: 0s
    min_heating_run_time: 0s
    min_idle_time: 0s
    cool_action:
      - switch.turn_on: air_cond
    heat_action:
      - switch.turn_on: heater
    idle_action:
      - switch.turn_off: air_cond
      - switch.turn_off: heater
    visual:
      min_temperature: 15
      max_temperature: 30
      temperature_step: 1
    on_control:
      then:
        - delay: 200ms 
        - lambda: |-
            auto call = id(num1).make_call();
            if (id(therm).mode == CLIMATE_MODE_COOL) {
              call.set_value(id(therm).target_temperature_high);
            } else if (id(therm).mode == CLIMATE_MODE_HEAT) {
              call.set_value(id(therm).target_temperature_low);
            }
            call.perform();



interval:
  - interval: 10s
    then:
      - script.execute: update_thermostat_temp

script:
  - id: update_thermostat_temp
    mode: queued
    then:
      - lambda: |-
          auto call = id(therm).make_call();
          if (id(therm).mode == CLIMATE_MODE_COOL) {
            call.set_target_temperature_high(id(num1).state);
          } else if (id(therm).mode == CLIMATE_MODE_HEAT) {
            call.set_target_temperature_low(id(num1).state);
          }
          call.perform();
```

## Slave Node Functionality

The **Slave Node** is responsible for the following:

1. **Sensing the Temperature:** The slave uses an SHT3x-D sensor to read the temperature in real-time.

2. **Displaying the Target Temperature:** The target temperature is shown on a TM1637 display 📟.

3. **Thermostat Control:** The slave has two GPIO buttons that allow the user to increase or decrease the thermostat set temperature, which is then sent to the master.

4. **Modbus Communication:** The slave node communicates with the master node using Modbus over RS485, sending temperature data and thermostat settings.

### Slave Node YAML Configuration:

```yaml title="slave_node.yaml" showLineNumbers
esphome:
  name: mirror-thermostat-test
  friendly_name: Mirror Thermostat Test



http_request:
  verify_ssl: false

esp32:
  board: esp32-poe
  framework:
    type: arduino

external_components:
  - source: github://epiclabs-io/esphome-modbus-server@master
    refresh: 60s
    components:
      - modbus_server

# Enable logging
logger:
  level: VERBOSE

# Enable Home Assistant API
api:
  encryption:
    key: "TBhOPb3cdw/qYvtPNMyKSEbCzTndys50sCuzWvcJtvY="

ota:
  - platform: esphome
    password: "fb39b717418246ea162532314bca89cf"

wifi:
  ssid: Bozhe Ime
  password: "0897923140"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Esp-Poe-Prototype"
    password: "QujZYANull7b"

captive_portal:

web_server:
  port: 80

i2c:
  sda: 13
  scl: 16
  scan: True
  id: bus_a


sensor:
  - platform: sht3xd
    temperature:
      name: "Temp"
      id: temp
    address: 0x44
    update_interval: 60s




uart:
  id: uart_1
  tx_pin: 4
  rx_pin: 36
  baud_rate: 9600
  stop_bits: 1
  data_bits: 8
  parity: NONE
  debug:
    direction: BOTH

modbus_server:
  id: modbus_1
  uart_id: uart_1
  address: 1 # slave address
  holding_registers:
    - start_address: 0x9001 # register to match master number address
      number: 1
      on_write: |-
        ESP_LOGI("ON_WRITE", "Write to address 0x9001, value=%d", value);
        auto call = id(target_temperature).make_call();
        call.set_value(value);
        call.perform();
        return value;
      on_read: |-
        int current_value = id(target_temperature).state;
        ESP_LOGI("ON_READ", "Read from address 0x9001, value=%d", current_value);
        return current_value;

    - start_address: 0x9002 # register to expose temperature
      number: 1
      on_read: |-
        int temp_value = id(temp).state;
        ESP_LOGI("ON_READ", "Read from address 0x9002, temp_value=%d", temp_value);
        return temp_value;

number:
  - platform: template
    id: target_temperature
    name: "Number Value"
    optimistic: true
    min_value: 15
    max_value: 30
    step: 1
    restore_value: true
    on_value:
      then:
        - component.update: tm1637_display


display:
  - platform: tm1637
    id: tm1637_display
    clk_pin: 33
    dio_pin: 32
    inverted: true
    length: 4
    lambda: |-
      // Display the target temperature on the TM1637 display
      it.printf(0, "%.0f", id(target_temperature).state);



binary_sensor:
  - platform: gpio
    pin:
      number: 34
      # mode: INPUT_PULLUP
      inverted: true
    name: "Increase Number"
    on_press:
      then:
        - lambda: |-
            int current_value = id(target_temperature).state;
            if (current_value < 30) {
              current_value += 1;
              id(target_temperature).publish_state(current_value);
            }

  - platform: gpio
    pin:
      number: 39
      # mode: INPUT_PULLUP
      inverted: true
    name: "Decrease Number"
    on_press:
      then:
        - lambda: |-
            int current_value = id(target_temperature).state;
            if (current_value > 15) {
              current_value -= 1;
              id(target_temperature).publish_state(current_value);
            }

```


### Wiring Instructions

To connect the components in this project, follow the wiring instructions below:

#### 1. ESP32 to TTL to RS485 Modules (Master and Slave)

- **ESP32 Master**:
  - **TX (GPIO 4)** → **TX pin** on RS485 module
  - **RX (GPIO 36)** → **RX pin** on RS485 module

- **ESP32 Slave**:
  - **TX (GPIO 4)** → **TX pin** on RS485 module
  - **RX (GPIO 36)** → **RX pin** on RS485 module

- **RS485 Modules**:
  - Connect the **A** and **B** terminals of the RS485 modules (Master and Slave) together:
    - **A (Master)** → **A (Slave)**
    - **B (Master)** → **B (Slave)**

- **VCC** and **GND** of each RS485 module should be connected to **3.3V** and **GND** of their respective ESP32 boards.

#### 2. SHT3x-D Sensor (Slave)

- **SDA (GPIO 13)** → **SDA** on SHT3x-D sensor
- **SCL (GPIO 16)** → **SCL** on SHT3x-D sensor
- **VCC** → **3.3V** on ESP32
- **GND** → **GND** on ESP32

#### 3. TM1637 Display (Slave)

- **CLK (GPIO 33)** → **CLK** pin on TM1637
- **DIO (GPIO 32)** → **DIO** pin on TM1637
- **VCC** → **3.3V** on ESP32
- **GND** → **GND** on ESP32

#### 4. Buttons for Thermostat Control (Slave)

- **Increase Button**:
  - One side to **GPIO 34**
  - Other side to **GND**

- **Decrease Button**:
  - One side to **GPIO 39**
  - Other side to **GND**

- **Toggle Button**:
  - One side to **GPIO 35**
  - Other side to **GND**
