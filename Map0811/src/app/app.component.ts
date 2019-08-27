import { Component, HostBinding } from '@angular/core';
import { latLng, tileLayer,circle,polygon, marker, polyline,icon} from 'leaflet';
import { HubConnection,  HubConnectionBuilder  } from '@aspnet/signalr';
import { trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        display: 'none',
        transform: 'translate3d(100%, 0, 0)'

      })),
      state('out', style({
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AppComponent {

  public hubConnection: HubConnection;
  // messages: string[] = [];
  // msg : string = "";
  markerlocation = [ 25.034509, 121.564472 ];
  routeA = ([]);
  infoState:string = 'in';
  car;
  layers;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 20,
    center: latLng(24.838957,121.009484)
  }


  ngOnInit() {

    this.hubConnection = new HubConnectionBuilder()
                            .withUrl('http://localhost:5005/chatHub')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));


      this.hubConnection.on("ReceiveGPS", (_lat,_lon) => {

        this.markerlocation = [_lat,_lon];
        this.routeA.push(this.markerlocation);

        this.car = marker(this.markerlocation,{
          icon: icon({
            iconSize: [ 52, 42 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'assets/truck_1-512.png',
            //shadowUrl: 'assets/C1.jpg'
         })
        }).on('click',()=>{
          this.toggleInfo();
        });

        this.layers = [
          this.car,
          polyline(this.routeA)
        ];

      });
    }


    // drawpath( _lat:string,_lon:string) : void {
    //   this.route.push([Number(_lat),Number(_lon)])
    //   console.log("lat = " +_lat + " lon =" + _lon);

    // }

    toggleInfo(){
      this.infoState = this.infoState === 'out' ? 'in' : 'out';
    }

}
