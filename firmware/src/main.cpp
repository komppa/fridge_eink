#include <GxEPD.h>
#include <GxGDEM029T94/GxGDEM029T94.h>   
#include <GxIO/GxIO_SPI/GxIO_SPI.h>
#include <GxIO/GxIO.h>  
#include <SPI.h>
#include <WiFi.h>
#include <HTTPClient.h>


#define WIFI_SSID       "Wokwi-GUEST"
#define WIFI_PASSWORD   ""

#define EPD_CS          5
#define EPD_DC          17
#define EPD_RST         16
#define EPD_BUSY        4
#define EPD_SCLK        18
#define EPD_MOSI        23
#define EPD_MISO        -1


GxIO_Class io(SPI, EPD_CS, EPD_DC, EPD_RST);
GxEPD_Class display(io, EPD_RST, EPD_BUSY);

HTTPClient https;
const char* endpoint = "https://api.kanye.rest/";


void setup() {

    Serial.begin(115200);

    Serial.println("Connecting to network...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD, 6);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to network..." + String(WIFI_SSID) + ":::" + String(WIFI_PASSWORD));
    }

    Serial.println("Connected to the WiFi network");

    https.begin(endpoint);
    
    int httpCode = https.GET();
    Serial.println("HTTP code: " + String(httpCode));
    String payload = https.getString();
    Serial.println("Payload: " + payload);


    SPI.begin(EPD_SCLK, EPD_MISO, EPD_MOSI);
    display.init();
    display.setRotation(2);

}


void loop() {
    delay(100);
}