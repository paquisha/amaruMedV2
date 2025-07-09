INSERT INTO role(createdat, createdby, name, description) VALUES
	(current_timestamp, 1, 'Estadistica', 'Usuario de análisis' ),
    (current_timestamp, 1, 'Medico', 'Usuario Medico' ),
    (current_timestamp, 1, 'Enfermeria', 'Usuario de Enfermeria' );

INSERT INTO permission(createdat, createdby, c, r, u, d, roleid, moduleid) VALUES
	(current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Estadistica'), (SELECT id FROM module WHERE name='patients')),
    (current_timestamp, 1, false, true, false, false, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='patients')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='antecedents')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='diagnostics')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='medicalexams')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='medicalrecords')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Medico'), (SELECT id FROM module WHERE name='vitalsigns')),
    (current_timestamp, 1, false, true, false, false, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='patients')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='antecedents')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='diagnostics')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='medicalexams')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='medicalrecords')),
    (current_timestamp, 1, true, true, true, true, (SELECT id FROM role WHERE name='Enfermeria'), (SELECT id FROM module WHERE name='vitalsigns'));
