INSERT INTO colleges(college_name,address) 
VALUES (
'CVR COLLEGE OF ENGINEERING',
'Ibrahimpatnam (Mandal), Pocharam Rd, Vastunagar, Mangalpalli (Village), Telangana 501510'
)

INSERT INTO branches (college_id,branch_name) values (1,'CSM');

ALTER TABLE secitons ADD COLUMN strength INT NOT NULL;

INSERT INTO sections (branch_id,section_name,strength) values (1,'A',65);
INSERT INTO sections (branch_id,section_name,strength) values (1,'B',64);
