import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  coordinates: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<string>();

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.initializeMap(position.coords.latitude, position.coords.longitude),
        (error) => {
          console.error('Error getting location: ', error);
          this.initializeMap(12.9497, 77.5904);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.initializeMap(12.9497, 77.5904);
    }
  }

  initializeMap(lat: number, lng: number): void {
    this.map = new mapboxgl.Map({
      accessToken : 'pk.eyJ1IjoiZ293c2ljIiwiYSI6ImNtOGg1dmI1ZjB2OTQybHNkbjQ1azRyamsifQ.OqwpiTrvcdUCc2LIhV7NnA',
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 9
    });

    this.marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  setLocation(event: Event): void {
    event.preventDefault();
    const lngLat = this.marker.getLngLat();
    const mapLink = `https://www.google.com/maps?q=${lngLat.lat},${lngLat.lng}`;
    this.locationSelected.emit(mapLink);
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}