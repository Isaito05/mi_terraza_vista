import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements AfterViewInit {
  latitude: number | null = null;
  longitude: number | null = null;
  error: string | null = null;
  ubicacion: string | null = null;
  manualAddress: string = ''; // Dirección ingresada manualmente
  @Output() direccionEmitida = new EventEmitter<string>();
  map!: L.Map;
  marker!: L.Marker;
  circle!: L.Circle;

  constructor(private geolocationService: GeolocationService) {}

  // Obtener la ubicación actual
  getLocation() {
    this.geolocationService.getCurrentLocation()
      .then((location) => {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.error = null;

        // Reverse geocoding para obtener la dirección
        this.geolocationService.reverseGeocode(location.latitude, location.longitude)
          .subscribe((data: any) => {
            this.ubicacion = data.results[0]?.formatted || 'Dirección no disponible';
            this.updateMap(location.latitude, location.longitude);
          });
      })
      .catch((err) => {
        this.error = err.message || 'No se pudo obtener la ubicación. Ofreciendo opciones...';
        this.getLocationByIP(); // Intentar con ubicación por IP
      });
  }

  // Obtener la ubicación aproximada por IP
  getLocationByIP() {
    this.geolocationService.getLocationByIP().subscribe((data: any) => {
      this.latitude = data.lat;
      this.longitude = data.lon;
      this.ubicacion = `Ubicación aproximada: ${data.city}, ${data.country}`;
      this.updateMap(data.lat, data.lon);
    });
  }

  // Convertir dirección manual en coordenadas
  convertAddressToCoordinates() {
    if (this.manualAddress.trim()) {
      this.geolocationService.geocodeAddress(this.manualAddress).subscribe((response: any) => {
        const result = response.results[0];
        const lat = result.geometry.lat;
        const lng = result.geometry.lng;

        this.latitude = lat;
        this.longitude = lng;
        this.ubicacion = result.formatted || 'Dirección no disponible';
        this.updateMap(lat, lng);
      });
    } else {
      this.error = 'Por favor, ingresa una dirección válida.';
    }
  }

  // Inicializar el mapa
  ngAfterViewInit() {
    this.map = L.map('map').setView([10.914737576541258, -74.78191852569581], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
       maxZoom: 18
    }).addTo(this.map);

    this.marker = L.marker([10.915789403810217, -74.78641390800477]).addTo(this.map);
    this.circle = L.circle([10.915789403810217, -74.78641390800477], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
  }).addTo(this.map);

  this.marker.bindPopup("¡Nos encontramos aquí!<br>Esta es nuestra área de cobertura con <b>domicilio gratis</b>.").openPopup();

    // Manejar clics en el mapa para seleccionar ubicación manualmente
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.latitude = lat;
      this.longitude = lng;
      this.marker.setLatLng([lat, lng]);
      this.geolocationService.reverseGeocode(lat, lng).subscribe((data: any) => {
        this.ubicacion = data.results[0]?.formatted || 'Dirección no disponible';
        this.direccionEmitida.emit(this.ubicacion!);
      });
    });
  }

  // Actualizar la posición del marcador en el mapa
  updateMap(lat: number, lng: number) {
    this.map.setView([lat, lng], 15);
    this.marker.setLatLng([lat, lng]);
  }
}
