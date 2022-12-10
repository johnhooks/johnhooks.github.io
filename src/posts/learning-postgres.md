---
title: Learning Postgres
seoTitle: Learning How to Configure, Use, and Backup Postgres Databases
slug: learning-postgres
abstract: Learning how to configure, use and backup Postgres databases.
isPublished: true
publishedOn: 2022-09-20
---

## Learning Postgres

At the moment this is less an article and more of a dumping zone for tidbits I would like to include in an article... And since I published it from the start of my website, I'll leave it here and let it grow.

_Note: Any name or variable that need to be provided is wrapped in curly brackets, example:_ `{user_name}`

### psql

- `\x` show expanded rows
- `\c {database_name}` connect to database named _database_name_
- `\l` list databases
- `\dt` list tables
- `\du` list users and access privileges
- `\dp` list sequences and access privileges
- `\dn+` list schemas and access privileges
- `\s` client command history

### SQL Hints

- Use single quotes for strings `WHERE "callSign" = 'hooky'`
- Use double quotes around column names `"User"."callSign"`

```sql
-- Delete complete data from an existing table
TRUNCATE TABLE {table_name};
```

```sql
-- Update Roles to Racer and Super Admin
update "public"."User" set roles = 65664 where "User"."callSign" = 'hooky';
```

### Users, Roles, and Privileges

#### Create new user

```sql
CREATE USER {user_name} WITH PASSWORD {password};
```

#### Grant Privileges to Database

##### References

["Granting access to all tables for a user"](https://dba.stackexchange.com/a/202917)<br /> ["ERROR: permission denied for sequence..."](https://stackoverflow.com/a/37675460)

_Reminder: Switch to the database on which you want to grant privileges._

##### Example

```sql
-- Grant connect to the database
GRANT CONNECT ON DATABASE {database_name} TO {user_name};

-- Grant to a schema
GRANT USAGE ON SCHEMA {schema_name} TO {user_name};

-- Grant all tables
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA {schema_name} TO {user_name};

-- !Important
-- Grant permission to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO {user_name};

-- !Important
-- Grant permission on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO {user_name};
```

#### Login in to `psql` as a different user to a specific database.

[psql: FATAL: database "<user>" does not exist](https://stackoverflow.com/a/21827460/3586344)

```sh
psql -U {user_name} {database_name}
```

#### List Privileges on a Database

##### References

[List the database privileges using psql](https://dba.stackexchange.com/a/152566)

```sql
SELECT grantee, privilege_type, table_name FROM information_schema.role_table_grants
WHERE NOT (grantee='postgres' OR grantee='PUBLIC');
```

### Backup

```sh
pg_dump dbname > infile
```

### Restoring

Databases are not automatically created when restoring from a dump. Before restoring with `psql` create the new database from `template0`. Also all users who own own or have permissions on objects in the dumped database must already exist before restoring. Otherwise it will not be restored with the same ownerships or permissions.

```sh
createdb -T template0 dbname
psql dbname < infile
```

### References

- [Backup and Restore](https://www.postgresql.org/docs/10/backup.html)
- [Privileges](https://www.postgresql.org/docs/10/ddl-priv.html)
- [Grant](https://www.postgresql.org/docs/10/sql-grant.html)
- [Database Roles](https://www.postgresql.org/docs/10/user-manag.html)
- [Managing roles and role attributes in PostgreSQL](https://www.prisma.io/dataguide/postgresql/authentication-and-authorization/role-management)
- [Managing privileges in PostgreSQL with grant and revoke](https://www.prisma.io/dataguide/postgresql/authentication-and-authorization/managing-privileges)
