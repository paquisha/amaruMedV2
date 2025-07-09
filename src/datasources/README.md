# Datasources

This directory contains config for datasources used by this app.

To automatically generate a repository, you must create a configuration file called **amarumedpgc.datasource.config.json** with the following specifications.

```json
{
  "name": "amarumedPGC",
  "connector": "postgresql",
  "url": "postgresql://user:password@host:port/database"
}
```
