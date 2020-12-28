CREATE SEQUENCE "query$query_id"; 

create table query (
	query_id integer NOT NULL DEFAULT nextval('query$query_id'::regclass),
	title varchar(1000),
	contents text,
	results text,
	encrypted bool,
	parent_id integer,
	insert_date timestamp,
	insert_id varchar(50),
	insert_ip varchar(15),
	update_date timestamp,
	update_id varchar(50),
	update_ip varchar(15),
	PRIMARY KEY (query_id)
);

/**
like 검색 성능 향상
*/
CREATE EXTENSION pg_trgm;
CREATE INDEX "query$title" ON query USING gin (title gin_trgm_ops);
CREATE INDEX "query$contents" ON query USING gin (contents gin_trgm_ops);

comment on table query is 'Query 실행기';

COMMENT ON COLUMN query.query_id IS '고유번호';
COMMENT ON COLUMN query.title IS '제목';
COMMENT ON COLUMN query.contents IS '내용';
COMMENT ON COLUMN query.results IS '실행결과';
COMMENT ON COLUMN query.encrypted IS '암호화';
COMMENT ON COLUMN query.parent_id IS '상위 Query 실행기 고유번호';
COMMENT ON COLUMN query.insert_date IS '최초입력일시';
COMMENT ON COLUMN query.insert_id IS '최초입력자ID';
COMMENT ON COLUMN query.insert_ip IS '최초입력자IP';
COMMENT ON COLUMN query.update_date IS '최종수정일시';
COMMENT ON COLUMN query.update_id IS '최종수정자ID';
COMMENT ON COLUMN query.update_ip IS '최종수정자IP';

CREATE SEQUENCE "query_history$query_history_id";

create table query_history (
	query_history_id integer NOT NULL DEFAULT nextval('query_history$query_history_id'::regclass),
	title varchar(1000),
	contents text,
	results text,
	encrypted bool,
	parent_id integer,
	query_id integer,
	autosave bool,
	insert_date timestamp,
	insert_id varchar(50),
	insert_ip varchar(15),
	update_date timestamp,                   
	update_id varchar(50),
	update_ip varchar(15),
	PRIMARY KEY (query_history_id)
);

comment on table query_history is 'Query 실행기 이력관리';

COMMENT ON COLUMN query_history.query_history_id IS '고유번호';
COMMENT ON COLUMN query_history.title IS '제목';
COMMENT ON COLUMN query_history.contents IS '내용';
COMMENT ON COLUMN query_history.results IS '실행결과';
COMMENT ON COLUMN query_history.encrypted IS '암호화';
COMMENT ON COLUMN query_history.parent_id IS '상위 Query 실행기 고유번호';
COMMENT ON COLUMN query_history.query_id IS 'Query 실행기 ID';
COMMENT ON COLUMN query_history.autosave IS '자동저장';
COMMENT ON COLUMN query_history.insert_date IS '최초입력일시';
COMMENT ON COLUMN query_history.insert_id IS '최초입력자ID';
COMMENT ON COLUMN query_history.insert_ip IS '최초입력자IP';
COMMENT ON COLUMN query_history.update_date IS '최종수정일시';
COMMENT ON COLUMN query_history.update_id IS '최종수정자ID';
COMMENT ON COLUMN query_history.update_ip IS '최종수정자IP';

