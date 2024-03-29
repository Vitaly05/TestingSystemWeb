﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(20)]
        public string Login { get; set; }

        public string Password { get; set; }

        [MaxLength(45)]
        public string Name { get; set; }

        [MaxLength(45)]
        public string Surname { get; set; }

        [MaxLength(45)]
        public string Patronymic { get; set; }

        [MaxLength(7)]
        public string Role { get; set; }

        [MaxLength(20)]
        public string Group { get; set; }


        public User() { }
        public User(User user)
        {
            Id = user.Id;
            Login = user.Login;
            Password = user.Password;
            Name = user.Name;
            Surname = user.Surname;
            Patronymic = user.Patronymic;
            Role = user.Role;
            Group = user.Group;
        }


        public override string ToString()
        {
            return $"{Surname} {Name} {Patronymic}";
        }

        public bool IsValid()
        {
            if (string.IsNullOrWhiteSpace(Login) ||
                string.IsNullOrWhiteSpace(Password) ||
                string.IsNullOrWhiteSpace(Name) ||
                string.IsNullOrWhiteSpace(Surname) ||
                string.IsNullOrWhiteSpace(Patronymic) ||
                string.IsNullOrWhiteSpace(Role))
            {
                return false;
            }

            return true;
        }
    }
}