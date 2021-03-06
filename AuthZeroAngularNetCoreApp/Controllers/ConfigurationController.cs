﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AuthZeroAngularNetCoreApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigurationController : ControllerBase
    {
        protected AuthConfig AuthConfig { get; }

        public ConfigurationController(IOptions<AuthConfig> authConfig)
        {
            AuthConfig = authConfig.Value;
        }

        [HttpGet]
        [Route("auth")]
        public IActionResult GetAuthConfiguration()
        {
            return Ok(AuthConfig);
        }
    }
}
