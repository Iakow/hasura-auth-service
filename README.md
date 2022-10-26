# The simplest auth service for working with Hasura.

Its task is to issue a jwt token containing the claims necessary to work with the GraphQL api that Hasura generates.
This allows you to work in the same database with Hasura.
Direct registration/login with email and password is available, as well as registration/login with id from third-party auth providers.
