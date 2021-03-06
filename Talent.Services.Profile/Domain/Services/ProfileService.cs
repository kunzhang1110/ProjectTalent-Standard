﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Security;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models;
using Talent.Services.Profile.Models.Profile;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;
        IMapper _mapper;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService,
                              IMapper mapper)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            throw new NotImplementedException();
        }

        public async Task<string> AddUpdateLanguage(AddLanguageViewModel language)
        {
            if (language.Id != null && language.Id != "") //update
            {
                var languageInDb = await _userLanguageRepository.GetByIdAsync(language.Id);
                languageInDb.Language = language.Name;
                languageInDb.LanguageLevel = language.Level;
                languageInDb.IsDeleted = language.IsDeleted;
                await _userLanguageRepository.Update(languageInDb);

                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                var userLanguageInDB = user.Languages.Single(l => l.Id == languageInDb.Id); //find original user language
                userLanguageInDB.Language = languageInDb.Language;
                userLanguageInDB.LanguageLevel = languageInDb.LanguageLevel;
                userLanguageInDB.IsDeleted = languageInDb.IsDeleted;
                await _userRepository.Update(user);
                return language.Id;
            }
            else //create
            {
                var newLanguage = new UserLanguage()
                {
                    Language = language.Name,
                    LanguageLevel = language.Level,
                    UserId = _userAppContext.CurrentUserId
                };
                await _userLanguageRepository.Add(newLanguage);
                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                user.Languages.Add(newLanguage);
                await _userRepository.Update(user);
                return newLanguage.Id;

            }
        }

        public async Task<string> AddUpdateSkill(AddSkillViewModel skill)
        {
            if (skill.Id != null && skill.Id != "") //update
            {
                var skillInDb = await _userSkillRepository.GetByIdAsync(skill.Id);
                skillInDb.Skill = skill.Name;
                skillInDb.ExperienceLevel = skill.Level;
                skillInDb.IsDeleted = skill.IsDeleted;
                await _userSkillRepository.Update(skillInDb);

                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                var userSkillInDB = user.Skills.Single(l => l.Id == skillInDb.Id); //find original user skill
                userSkillInDB.Skill = skillInDb.Skill;
                userSkillInDB.ExperienceLevel = skillInDb.ExperienceLevel;
                userSkillInDB.IsDeleted = skillInDb.IsDeleted;
                await _userRepository.Update(user);
                return skill.Id;
            }
            else //create
            {
                var newSkill = new UserSkill()
                {
                    Skill = skill.Name,
                    ExperienceLevel = skill.Level,
                };
                await _userSkillRepository.Add(newSkill);
                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                user.Skills.Add(newSkill);
                await _userRepository.Update(user);
                return newSkill.Id;

            }
        }


        public async Task<string> AddUpdateExperience(ExperienceViewModel experience)
        {
            if (experience.Id != null && experience.Id != "") //update
            {
                var experienceInDb = await _userExperienceRepository.GetByIdAsync(experience.Id);
                _mapper.Map(experience, experienceInDb);
                await _userExperienceRepository.Update(experienceInDb);

                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                var userExperienceInDB = user.Experience.Single(ex => ex.Id == experience.Id);
                _mapper.Map(experience, userExperienceInDB);
                await _userRepository.Update(user);
                return experience.Id;
            }
            else //create
            {
                var newExperience = _mapper.Map<ExperienceViewModel, UserExperience>(experience);

                await _userExperienceRepository.Add(newExperience);
                var user = await _userRepository.GetByIdAsync(_userAppContext.CurrentUserId);
                user.Experience.Add(newExperience);
                await _userRepository.Update(user);
                return newExperience.Id;

            }
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User user = await _userRepository.GetByIdAsync(Id);

            //Mapping Language
            List<UserLanguage> userLanguages = user.Languages;
            List<AddLanguageViewModel> languagesViewModel = new List<AddLanguageViewModel>();
            foreach (var lang in userLanguages)
            {
                if (lang.IsDeleted == false)
                {
                    languagesViewModel.Add(new AddLanguageViewModel()
                    {
                        Name = lang.Language,
                        Level = lang.LanguageLevel,
                        Id = lang.Id,
                        CurrentUserId = lang.UserId
                    });
                }
            }
            //Mapping Skill
            List<UserSkill> userSkills = user.Skills;
            List<AddSkillViewModel> skillsViewModel = new List<AddSkillViewModel>();
            foreach (var skill in userSkills)
            {
                if (skill.IsDeleted == false)
                {
                    skillsViewModel.Add(new AddSkillViewModel()
                    {
                        Name = skill.Skill,
                        Level = skill.ExperienceLevel,
                        Id = skill.Id,
                    });
                }
            }
            //Mapping Experience
            List<UserExperience> userExperience = user.Experience;
            List<ExperienceViewModel> experienceViewModel = new List<ExperienceViewModel>();
            foreach (var exp in userExperience)
            {
                if (exp.IsDeleted == false)
                {
                    experienceViewModel.Add(_mapper.Map<UserExperience, ExperienceViewModel>(exp));
                }
            }


            //Mapping Profile
            TalentProfileViewModel profileViewModel = _mapper.Map<User, TalentProfileViewModel>(user);
            profileViewModel.Languages = languagesViewModel;
            profileViewModel.Skills = skillsViewModel;
            profileViewModel.Experience = experienceViewModel;

            return profileViewModel;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            User user = _mapper.Map<TalentProfileViewModel, User>(model);
            User existingUser = await _userRepository.GetByIdAsync(updaterId);
            user.Id = updaterId;
            user.UId = existingUser.UId;
            user.CreatedOn = existingUser.CreatedOn;
            user.CreatedBy = existingUser.CreatedBy;
            user.UpdatedOn = DateTime.Now;
            user.UpdatedBy = updaterId;
            user.IsDeleted = existingUser.IsDeleted;
            user.Login = existingUser.Login;


            await _userRepository.Update(user);
            return true;
        }




        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                //profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {

            var talents = await _userRepository.FindAsync(user => user.FirstName != null);

            var result = new List<TalentSnapshotViewModel>();
            foreach (var talent in talents)
            {
                try
                {//some document may not contain certain field
                    result.Add(new TalentSnapshotViewModel()
                    {
                        Id = talent.Id,
                        Name = talent.FirstName + " " + talent.LastName,
                        Summary = talent.Summary,
                        CurrentEmployer = talent.Experience.LastOrDefault().Company,//last employment
                        Visa = talent.VisaStatus,
                        Position = talent.Experience.LastOrDefault().Position,//last position
                        Skills = talent.Skills.Select(skill => skill.Skill).ToList()
                    });
                }
                catch (Exception e)
                {
                    //logging errors
                }

            }
            return result.Skip((position) * increment).Take(increment);
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
