db = db.getSiblingDB("db_todoapp");

db.createUser({
  user: "root",
  email: "pl01psa
  pwd: "admin_pwd",
  roles: [    { role: "root", db: "admin" }  ]
});

db.createUser({
  user: "app_backend",
  pwd: "password_backend_123", 
  roles: [
    { role: "readWrite", db: "db_todoapp" },
    { role: "dbAdmin", db: "db_todoapp" }
  ]
});

db.createUser({
  user: "admin_app",
  pwd: "password_admin_123",
  roles: [
    { role: "dbAdmin", db: "db_todoapp" },
    { role: "userAdmin", db: "db_todoapp" }
  ]
});

db = db.getSiblingDB("admin");
db.createUser({
  user: "backup_user",
  pwd: "password_backup_123",
  roles: [
    { role: "backup", db: "admin" },
    { role: "readAnyDatabase", db: "admin" }
  ]
});