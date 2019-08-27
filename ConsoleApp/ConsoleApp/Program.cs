using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace ConsoleApp{
    class Program{
        static void Main(string[] args){

            //載入檔案
            string text = File.ReadAllText(@"D:\Build_School\Ben sent files\SignalRMoveCar\car3.json");
            RootObject item = JsonConvert.DeserializeObject<RootObject>(text);
            Console.Write(item.locations.Count.ToString());

            var connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5000/chatHub")
            .ConfigureLogging(logging => {
                            //logging.AddConsole();             
                        })
            .Build();

            connection.StartAsync().ContinueWith(task => {
                if (task.IsFaulted)
                {
                    Console.WriteLine("There was an error opening the connection:{0}",
                                      task.Exception.GetBaseException());
                }
                else
                {
                    Console.WriteLine("Connected");
                }

            }).Wait();


            item.locations.ForEach(i =>
            {
                Console.WriteLine("經度 = {0},緯度 = {1}",i.Lon,i.Lat);
                Thread.Sleep(1000); //Delay 1秒                
                connection.InvokeAsync<string>("GetGPS", i.Lat, i.Lon).Wait();
            });

            Console.ReadLine();
        }
    }


    public class RootObject
    {
        public string _id { get; set; }
        public string GsmNo { get; set; }
        public string CarNo { get; set; }
        public string Time { get; set; }
        public List<Location> locations { get; set; }
    }

    public class Location
    {
        public string _id { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public string Addr { get; set; }
        public string Time { get; set; }
        public string CarStatus { get; set; }
        public string Mile { get; set; }
    }


}
