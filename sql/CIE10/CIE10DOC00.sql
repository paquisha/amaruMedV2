DELETE FROM disease;
DELETE FROM diseasetype;
INSERT INTO diseasetype(createdat,createdby,name) VALUES(current_timestamp, 0, 'NO DEFINIDO');
