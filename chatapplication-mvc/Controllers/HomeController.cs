using chatapplication_mvc.Hubs;
using chatapplication_mvc.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace chatapplication_mvc.Controllers
{
    public class HomeController : Controller
    {
        private static readonly string RoomId = Guid.NewGuid().ToString();
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("/chatvideo")]
        public IActionResult Room()
        {
            ViewBag.roomId = RoomId;
            return View();
        }

        [HttpGet("/Home/WelcomeModal")]
        public IActionResult WelcomeModal()
        {
            return PartialView("_UserDialogPartial");
        }
    }
}