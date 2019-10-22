using Microsoft.AspNetCore.Mvc;

namespace AuthZeroAngularNetCoreApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigurationController : ControllerBase
    {
        [HttpGet]
        [Route("auth")]
        public IActionResult GetAuthConfiguration()
        {
            var config = new
            {
                clientId = "",
                domain = ""
            };
            return Ok(config);
        }
    }
}
