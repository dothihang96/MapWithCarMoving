using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSRCore
{
    public class ChatHub : Hub
    {
        public async Task GetGPS(string _lat,string _lon)
        {
            await Clients.All.SendAsync("ReceiveGPS", _lat,_lon );
        }
    }



}
