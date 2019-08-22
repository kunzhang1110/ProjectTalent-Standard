using System;

namespace Talent.Services.Profile.Models.Profile
{
    public class ExperienceViewModel
    {
        public String Id { get; set; }
        public String Company { get; set; }
        public String Position { get; set; }
        public String Responsibilities { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool IsDeleted { get; set; }
    }
}
