import sqlite3

class PatientDoctorDB:
    def __init__(self, db_name='patient_doctor.db'):
        self.db_name = db_name
        # self._initialize_database()

    def _initialize_database(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            doctor_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            specialty TEXT,
            phone TEXT,
            email TEXT,
            hospital TEXT
        )
        ''')
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            patient_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            birthdate TEXT
        )
        ''')
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctor_patient (
            doctor_id INTEGER,
            patient_id INTEGER,
            FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id),
            FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
            PRIMARY KEY (doctor_id, patient_id)
        )
        ''')
        conn.commit()
        conn.close()

    def add_doctor(self, doctor_id, name, specialty=None, phone=None, email=None, hospital=None):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        if self.if_doctor_exists(doctor_id):
            return False, "Doctor already exists"
        cursor.execute('''
            INSERT INTO doctors (doctor_id, name, specialty, phone, email, hospital) 
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (doctor_id, name, specialty, phone, email, hospital))
        conn.commit()
        conn.close()
        return True, "Doctor added successfully"

    def add_patient(self, patient_id, name, phone=None, email=None, address=None, birthdate=None):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        if self.if_patient_exists(patient_id):
            return False, "Patient already exists"
        cursor.execute('''
            INSERT INTO patients (patient_id, name, phone, email, address, birthdate) 
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (patient_id, name, phone, email, address, birthdate))
        conn.commit()
        conn.close()
        return True, "Patient added successfully"

    def assign_patient_to_doctor(self, doctor_id, patient_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        if self.if_doctor_exists(doctor_id) == False or self.if_patient_exists(patient_id) == False:
            return False, "Doctor or Patient does not exist"
        if (doctor_id, patient_id) in cursor.execute('SELECT doctor_id, patient_id FROM doctor_patient').fetchall():
            return False, "Patient already assigned to this doctor"
        cursor.execute('INSERT INTO doctor_patient (doctor_id, patient_id) VALUES (?, ?)', (doctor_id, patient_id))
        conn.commit()
        conn.close()
        return True, "Patient assigned to doctor successfully"

    def get_doctors(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM doctors')
        doctors = cursor.fetchall()
        conn.close()
        return doctors, ""
    
    def get_patients(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM patients')
        patients = cursor.fetchall()
        conn.close()
        return patients, ""
    
    def get_patient_of_doctor(self, doctor_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT patient_id FROM doctor_patient WHERE doctor_id = ?', (doctor_id,))
        patients = cursor.fetchall()
        conn.close()
        if patients is None:
            return None, "No patients assigned to this doctor"
        return patients, "Patients assigned to this doctor"
    
    def get_doctor_of_patient(self, patient_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT doctor_id FROM doctor_patient WHERE patient_id = ?', (patient_id,))
        doctor = cursor.fetchone()
        conn.close()
        if doctor is None:
            return None, "No doctor assigned to this patient"
        return doctor, "Doctor assigned to this patient"
    
    def get_doctor_detail(self, doctor_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        if self.if_doctor_exists(doctor_id) == False:
            return None, "Doctor does not exist"
        cursor.execute('SELECT * FROM doctors WHERE doctor_id = ?', (doctor_id,))
        doctor = cursor.fetchone()
        conn.close()
        return doctor, "Doctor details fetched successfully"
    
    def get_patient_detail(self, patient_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        if self.if_patient_exists(patient_id) == False:
            return None, "Patient does not exist"
        cursor.execute('SELECT * FROM patients WHERE patient_id = ?', (patient_id,))
        patient = cursor.fetchone()
        conn.close()
        return patient, "Patient details fetched successfully"
    
    def if_patient_exists(self, patient_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM patients WHERE patient_id = ?', (patient_id,))
        patient = cursor.fetchone()
        conn.close()
        return patient is not None
    
    def if_doctor_exists(self, doctor_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM doctors WHERE doctor_id = ?', (doctor_id,))
        doctor = cursor.fetchone()
        conn.close()
        return doctor is not None
    


if __name__ == "__main__":
    db = PatientDoctorDB()
    db.add_doctor(10001, 'Dr. Nisha Choudhary')
    db.add_doctor(10002, "Dr. Vimal Jain")
    db.add_doctor(10003, "Dr. Ravi Kumar")

    db.add_patient(20001, 'Vivek Patidar')
    db.add_patient(20002, 'Shashvat Jain')
    db.add_patient(20003, 'Pranay Pandey')
    db.add_patient(20004, 'Pranav Sharma')
    db.add_patient(20005, 'Kamal Kumar')
    db.add_patient(20006, 'Rajesh Sharma')

    db.assign_patient_to_doctor(10001, 20001)
    db.assign_patient_to_doctor(10001, 20002)
    db.assign_patient_to_doctor(10001, 20003)
    db.assign_patient_to_doctor(10002, 20004)
    db.assign_patient_to_doctor(10002, 20005)
    db.assign_patient_to_doctor(10003, 20006)

    print(f"List of all the doctors {db.get_doctors()[0]}")
    print(f"Patient of Doctor 10001 are {db.get_patient_of_doctor(10001)[0]}")