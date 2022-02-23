CREATE SCHEMA query;
ALTER TABLE query SET SCHEMA query;
ALTER TABLE query_history SET SCHEMA query;
alter SEQUENCE "query$query_id" SET SCHEMA query;
alter SEQUENCE "query_history$query_history_id" SET SCHEMA query;
alter table query.query alter column query_id set default nextval('query.query$query_id'::regclass);
alter table query.query_history alter column query_history_id set default nextval('query.query_history$query_history_id'::regclass);

