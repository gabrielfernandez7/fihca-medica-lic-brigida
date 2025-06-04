// Datos de ejemplo
let patients = [
    {
        id: 1,
        name: "Juan Pérez",
        age: 45,
        gender: "Masculino",
        document: "12345678",
        phone: "987654321",
        address: "Av. Principal 123",
        priority: "high",
        admissionDate: "2023-05-15",
        doctor: "Dra. María González",
        reason: "Dolor en el pecho y dificultad para respirar",
        history: "Hipertensión arterial desde 2018",
        diagnosis: "Infarto agudo de miocardio",
        treatment: "Aspirina 100mg diarios, reposo absoluto",
        observations: "Requiere seguimiento cardiológico"
    },
    {
        id: 2,
        name: "Ana López",
        age: 32,
        gender: "Femenino",
        document: "87654321",
        phone: "987123456",
        address: "Calle Secundaria 456",
        priority: "medium",
        admissionDate: "2023-06-20",
        doctor: "Dr. Carlos Ramírez",
        reason: "Fiebre alta y dolor de cabeza persistente",
        history: "Ninguna condición previa conocida",
        diagnosis: "Infección bacteriana",
        treatment: "Amoxicilina 500mg cada 8 horas por 7 días",
        observations: "Controlar temperatura cada 6 horas"
    },
    {
        id: 3,
        name: "Luis Martínez",
        age: 28,
        gender: "Masculino",
        document: "56781234",
        phone: "912345678",
        address: "Jr. Los Olivos 789",
        priority: "low",
        admissionDate: "2023-06-25",
        doctor: "Dra. Patricia Sánchez",
        reason: "Dolor en brazo derecho después de caída",
        history: "Fractura de brazo izquierdo en 2015",
        diagnosis: "Esguince de muñeca derecha",
        treatment: "Inmovilización con férula por 2 semanas",
        observations: "Aplicar hielo cada 4 horas"
    }
];

// Elementos del DOM
const patientForm = document.getElementById('patientForm');
const savePatientBtn = document.getElementById('savePatientBtn');
const patientCardsContainer = document.getElementById('patientCardsContainer');
const searchInput = document.getElementById('searchInput');
const patientDetailsContent = document.getElementById('patientDetailsContent');
const printPatientBtn = document.getElementById('printPatientBtn');

// Variables
let currentPatientId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    renderPatientCards(patients);
    
    // Evento para guardar nueva ficha
    savePatientBtn.addEventListener('click', savePatient);
    
    // Evento para búsqueda
    searchInput.addEventListener('input', searchPatients);
    
    // Evento para imprimir
    printPatientBtn.addEventListener('click', printPatientDetails);
});

// Función para renderizar las fichas de pacientes
function renderPatientCards(patientsToRender) {
    patientCardsContainer.innerHTML = '';
    
    if (patientsToRender.length === 0) {
        patientCardsContainer.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-file-medical fa-3x mb-3 text-muted"></i>
                        <h5 class="text-muted">No se encontraron fichas médicas</h5>
                        <button class="btn btn-hospital mt-3" data-bs-toggle="modal" data-bs-target="#patientFormModal">
                            <i class="fas fa-plus me-2"></i> Crear nueva ficha
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    patientsToRender.forEach(patient => {
        const priorityClass = getPriorityClass(patient.priority);
        const priorityText = getPriorityText(patient.priority);
        
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card patient-card ${priorityClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${patient.name}</h5>
                        <span class="badge badge-priority ${'badge-' + patient.priority}">
                            ${priorityText}
                        </span>
                    </div>
                    <p class="card-text text-muted mb-1">
                        <i class="fas fa-id-card me-2"></i> ${patient.document}
                    </p>
                    <p class="card-text text-muted mb-1">
                        <i class="fas fa-user me-2"></i> ${patient.gender}, ${patient.age} años
                    </p>
                    <p class="card-text text-muted mb-3">
                        <i class="fas fa-calendar me-2"></i> Ingreso: ${formatDate(patient.admissionDate)}
                    </p>
                    <p class="card-text">
                        <strong>Motivo:</strong> ${patient.reason.substring(0, 50)}${patient.reason.length > 50 ? '...' : ''}
                    </p>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-sm btn-outline-secondary" onclick="editPatient(${patient.id})">
                            <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-hospital" onclick="viewPatientDetails(${patient.id})">
                            <i class="fas fa-eye me-1"></i> Ver
                        </button>
                    </div>
                </div>
            </div>
        `;
        patientCardsContainer.appendChild(card);
    });
}

// Función para guardar nueva ficha
function savePatient() {
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value);
    const gender = document.getElementById('patientGender').value;
    const document = document.getElementById('patientDocument').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const address = document.getElementById('patientAddress').value.trim();
    const priority = document.getElementById('patientPriority').value;
    const admissionDate = document.getElementById('patientAdmissionDate').value;
    const doctor = document.getElementById('patientDoctor').value.trim();
    const reason = document.getElementById('patientReason').value.trim();
    const history = document.getElementById('patientHistory').value.trim();
    const diagnosis = document.getElementById('patientDiagnosis').value.trim();
    const treatment = document.getElementById('patientTreatment').value.trim();
    const observations = document.getElementById('patientObservations').value.trim();
    
    // Validación básica
    if (!name || !age || !gender || !document || !priority || !admissionDate) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Crear nuevo paciente
    const newPatient = {
        id: currentPatientId++,
        name,
        age,
        gender,
        document,
        phone,
        address,
        priority,
        admissionDate,
        doctor,
        reason,
        history,
        diagnosis,
        treatment,
        observations
    };
    
    // Agregar al array
    patients.push(newPatient);
    
    // Renderizar tarjetas
    renderPatientCards(patients);
    
    // Cerrar modal y limpiar formulario
    bootstrap.Modal.getInstance(document.getElementById('patientFormModal')).hide();
    patientForm.reset();
    
    // Mostrar mensaje de éxito
    alert('Ficha médica guardada exitosamente');
}

// Función para ver detalles del paciente
function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    const priorityText = getPriorityText(patient.priority);
    
    patientDetailsContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5 class="mb-3">Información del Paciente</h5>
                <p><strong>Nombre:</strong> ${patient.name}</p>
                <p><strong>Documento:</strong> ${patient.document}</p>
                <p><strong>Edad:</strong> ${patient.age} años</p>
                <p><strong>Género:</strong> ${patient.gender}</p>
                <p><strong>Teléfono:</strong> ${patient.phone || 'No especificado'}</p>
                <p><strong>Dirección:</strong> ${patient.address || 'No especificada'}</p>
            </div>
            <div class="col-md-6">
                <h5 class="mb-3">Información Médica</h5>
                <p><strong>Prioridad:</strong> <span class="badge ${'badge-' + patient.priority}">${priorityText}</span></p>
                <p><strong>Fecha de Ingreso:</strong> ${formatDate(patient.admissionDate)}</p>
                <p><strong>Médico Tratante:</strong> ${patient.doctor || 'No especificado'}</p>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-12">
                <h5 class="mb-3">Motivo de Consulta</h5>
                <p>${patient.reason || 'No especificado'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h5 class="mb-3">Historial Médico</h5>
                <p>${patient.history || 'No especificado'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h5 class="mb-3">Diagnóstico</h5>
                <p>${patient.diagnosis || 'No especificado'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h5 class="mb-3">Tratamiento</h5>
                <p>${patient.treatment || 'No especificado'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h5 class="mb-3">Observaciones</h5>
                <p>${patient.observations || 'No especificado'}</p>
            </div>
        </div>
    `;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('patientDetailsModal'));
    modal.show();
}

// Función para editar paciente
function editPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    // Llenar formulario con datos del paciente
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = patient.age;
    document.getElementById('patientGender').value = patient.gender;
    document.getElementById('patientDocument').value = patient.document;
    document.getElementById('patientPhone').value = patient.phone || '';
    document.getElementById('patientAddress').value = patient.address || '';
    document.getElementById('patientPriority').value = patient.priority;
    document.getElementById('patientAdmissionDate').value = patient.admissionDate;
    document.getElementById('patientDoctor').value = patient.doctor || '';
    document.getElementById('patientReason').value = patient.reason || '';
    document.getElementById('patientHistory').value = patient.history || '';
    document.getElementById('patientDiagnosis').value = patient.diagnosis || '';
    document.getElementById('patientTreatment').value = patient.treatment || '';
    document.getElementById('patientObservations').value = patient.observations || '';
    
    // Actualizar el botón de guardar para editar
    savePatientBtn.textContent = 'Actualizar Ficha';
    savePatientBtn.onclick = function() {
        updatePatient(patientId);
    };
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('patientFormModal'));
    modal.show();
}

// Función para actualizar paciente
function updatePatient(patientId) {
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return;
    
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value);
    const gender = document.getElementById('patientGender').value;
    const document = document.getElementById('patientDocument').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const address = document.getElementById('patientAddress').value.trim();
    const priority = document.getElementById('patientPriority').value;
    const admissionDate = document.getElementById('patientAdmissionDate').value;
    const doctor = document.getElementById('patientDoctor').value.trim();
    const reason = document.getElementById('patientReason').value.trim();
    const history = document.getElementById('patientHistory').value.trim();
    const diagnosis = document.getElementById('patientDiagnosis').value.trim();
    const treatment = document.getElementById('patientTreatment').value.trim();
    const observations = document.getElementById('patientObservations').value.trim();
    
    // Validación básica
    if (!name || !age || !gender || !document || !priority || !admissionDate) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Actualizar paciente
    patients[patientIndex] = {
        ...patients[patientIndex],
        name,
        age,
        gender,
        document,
        phone,
        address,
        priority,
        admissionDate,
        doctor,
        reason,
        history,
        diagnosis,
        treatment,
        observations
    };
    
    // Renderizar tarjetas
    renderPatientCards(patients);
    
    // Cerrar modal y limpiar formulario
    bootstrap.Modal.getInstance(document.getElementById('patientFormModal')).hide();
    patientForm.reset();
    
    // Restaurar el botón de guardar
    savePatientBtn.textContent = 'Guardar Ficha';
    savePatientBtn.onclick = savePatient;
    
    // Mostrar mensaje de éxito
    alert('Ficha médica actualizada exitosamente');
}

// Función para buscar pacientes
function searchPatients() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderPatientCards(patients);
        return;
    }
    
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.document.toLowerCase().includes(searchTerm) ||
        (patient.doctor && patient.doctor.toLowerCase().includes(searchTerm)) ||
        (patient.reason && patient.reason.toLowerCase().includes(searchTerm)) ||
        (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchTerm))
    );
    
    renderPatientCards(filteredPatients);
}

// Función para imprimir detalles del paciente
function printPatientDetails() {
    const printContent = patientDetailsContent.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container mt-4">
            <div class="text-center mb-4">
                <h2>Hospital San Juan</h2>
                <h4>Ficha Médica</h4>
            </div>
            ${printContent}
            <div class="mt-4 text-muted text-end">
                <p>Impreso el: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Volver a mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('patientDetailsModal'));
    modal.show();
}

// Funciones auxiliares
function getPriorityClass(priority) {
    switch(priority) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return '';
    }
}

function getPriorityText(priority) {
    switch(priority) {
        case 'high': return 'Alta Prioridad';
        case 'medium': return 'Prioridad Media';
        case 'low': return 'Prioridad Baja';
        default: return '';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Hacer funciones accesibles globalmente
window.viewPatientDetails = viewPatientDetails;
window.editPatient = editPatient;