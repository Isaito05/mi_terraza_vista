import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  // Obtener ubicación actual
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocalización no soportada en este navegador.'));
      }
    });
  }

  // Reverse geocoding (coordenadas a dirección)
  reverseGeocode(lat: number, lng: number) {
    return this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=6d8e1b34f1de41f795574b13c9914a5c`);
  }

  // Geocodificación (dirección a coordenadas)
  geocodeAddress(address: string) {
    return this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=6d8e1b34f1de41f795574b13c9914a5c`);
  }

  // Ubicación por IP
  getLocationByIP() {
    return this.http.get('http://ip-api.com/json');
  }
}
