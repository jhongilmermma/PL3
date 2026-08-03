/**
 * ============================================================
 * MOTOR DE INFERENCIA - Sistema Experto
 * Enfermedades Respiratorias Crónicas
 * Basado en la tesis de Arias Caballero (UPN 2019)
 * ============================================================
 */

class MotorInferenciaRespiratorio {

    static get QUESTIONS() {
        return [
            { id: 1, text: '¿Tiene o siente dolor de cabeza?', icon: '🤕', hint: 'Dolor en la cabeza', diseases: ['Enfermedad Respiratoria'] },
            { id: 2, text: '¿Tiene o siente dolor de garganta?', icon: '😣', hint: 'Dolor o irritación en la garganta', diseases: ['Enfermedad Respiratoria'] },
            { id: 3, text: '¿Tiene o siente dolor en el cuerpo?', icon: '💪', hint: 'Dolores musculares o corporales', diseases: ['Enfermedad Respiratoria'] },
            { id: 4, text: '¿Tiene o siente dolor abdominal?', icon: '🤢', hint: 'Dolor en el estómago o abdomen', diseases: ['Enfermedad Respiratoria'] },
            { id: 5, text: '¿Tiene o siente escalofríos?', icon: '🥶', hint: 'Sensación de frío y temblores', diseases: ['Enfermedad Respiratoria'] },
            { id: 6, text: '¿Tiene o siente falta de energía?', icon: '😴', hint: 'Cansancio o fatiga constante', diseases: ['Enfermedad Respiratoria', 'Hipertensión Pulmonar'] },
            { id: 7, text: '¿Tiene o siente mareos?', icon: '😵', hint: 'Sensación de vértigo o inestabilidad', diseases: ['Enfermedad Respiratoria'] },
            { id: 8, text: '¿Tiene o siente náuseas?', icon: '🤮', hint: 'Ganas de vomitar', diseases: ['Enfermedad Respiratoria'] },
            { id: 9, text: '¿Tiene o siente vómitos?', icon: '🤮', hint: 'Vómitos o arcadas', diseases: ['Enfermedad Respiratoria'] },
            { id: 10, text: '¿Tiene o siente tos?', icon: '😷', hint: 'Tos seca o con flema', diseases: ['Enfermedad Respiratoria'] },
            { id: 11, text: '¿Tiene mucosidades nasales?', icon: '🤧', hint: 'Moco o congestión nasal', diseases: ['Enfermedad Respiratoria'] },
            { id: 12, text: '¿Tiene fiebre?', icon: '🌡️', hint: 'Temperatura corporal elevada', diseases: ['Enfermedad Respiratoria'] },
            { id: 13, text: '¿Tiene o siente diarrea?', icon: '🚽', hint: 'Deposiciones líquidas frecuentes', diseases: ['Enfermedad Respiratoria'] },
            { id: 14, text: '¿Tiene opresión en el pecho?', icon: '🫀', hint: 'Sensación de presión o apretón en el pecho', diseases: ['Asma', 'EPOC'] },
            { id: 15, text: '¿Tiene pitido al respirar?', icon: '🫁', hint: 'Silbido o chirrido al respirar', diseases: ['Asma', 'EPOC'] },
            { id: 16, text: '¿Tiene dificultad para respirar?', icon: '😮‍💨', hint: 'Falta de aire o respiración difícil', diseases: ['Hipertensión Pulmonar', 'Asma', 'EPOC'] },
            { id: 17, text: '¿Tiene color azulado en los labios?', icon: '🟦', hint: 'Labios con tono azulado (cianosis)', diseases: ['Hipertensión Pulmonar'] },
            { id: 18, text: '¿Tiene hinchazón de tobillos?', icon: '🦶', hint: 'Tobillos inflamados o edemas', diseases: ['Hipertensión Pulmonar'] },
            { id: 19, text: '¿Tiene dolor en el pecho?', icon: '❤️‍🩹', hint: 'Dolor o molestia en la zona del pecho', diseases: ['Asma', 'EPOC'] },
            { id: 20, text: '¿Tiene falta de aire?', icon: '🌬️', hint: 'Sensación de no poder respirar bien', diseases: ['Asma', 'EPOC'] },
            { id: 21, text: '¿Tiene problemas para dormir por falta de respiración?', icon: '😴', hint: 'Despierta por dificultad para respirar', diseases: ['Asma', 'EPOC'] },
            { id: 22, text: '¿Tiene tos al respirar?', icon: '😷', hint: 'Tos que aparece al inspirar o espirar', diseases: ['Asma', 'EPOC'] },
            { id: 23, text: '¿Tiene tos crónica con mucosidad?', icon: '🫁', hint: 'Tos persistente con flema (más de 3 meses)', diseases: ['EPOC'] },
            { id: 24, text: '¿Tiene infecciones respiratorias frecuentes?', icon: '🦠', hint: 'Resfriados o infecciones recurrentes', diseases: ['EPOC'] },
            { id: 25, text: '¿Tiene pérdida de peso?', icon: '⚖️', hint: 'Pérdida de peso no intencionada', diseases: ['EPOC'] },
            { id: 26, text: '¿Tiene fatiga?', icon: '😩', hint: 'Cansancio extremo y persistente', diseases: ['Hipertensión Pulmonar'] },
            { id: 27, text: '¿Tiene episodios de desmayo?', icon: '😵', hint: 'Desmayos o pérdida de conciencia', diseases: ['Hipertensión Pulmonar'] },
            { id: 28, text: '¿Tiene color azulado en la piel?', icon: '🔵', hint: 'Piel con tono azulado (cianosis)', diseases: ['Hipertensión Pulmonar'] },
            { id: 29, text: '¿Tiene pulso acelerado?', icon: '💓', hint: 'Palpitaciones o latidos rápidos', diseases: ['Hipertensión Pulmonar'] },
            { id: 30, text: '¿Tiene palpitación fuerte del corazón?', icon: '💗', hint: 'Latidos cardíacos fuertes o irregulares', diseases: ['Hipertensión Pulmonar'] }
        ];
    }

    static get DISEASE_INFO() {
        return {
            'Enfermedad Respiratoria': {
                name: 'Enfermedad Respiratoria Aguda',
                icon: '🦠',
                desc: 'Infección de las vías respiratorias causada por virus o bacterias. Los síntomas incluyen fiebre, tos, dolor de garganta y congestión nasal.',
                recommendation: '💊 Reposo absoluto, hidratación abundante (2-3 litros de agua al día), paracetamol para la fiebre (si supera los 38°C). Acudir al médico si los síntomas empeoran o persisten más de 5 días.'
            },
            'Asma': {
                name: 'Asma Bronquial',
                icon: '🫁',
                desc: 'Enfermedad inflamatoria crónica de las vías respiratorias que causa episodios recurrentes de sibilancias, dificultad para respirar, opresión torácica y tos.',
                recommendation: '💊 Evitar desencadenantes (alérgenos, humo, ejercicio intenso). Uso de inhaladores (broncodilatadores) según indicación médica. Seguimiento con neumólogo cada 3-6 meses.'
            },
            'EPOC': {
                name: 'Enfermedad Pulmonar Obstructiva Crónica (EPOC)',
                icon: '🫁',
                desc: 'Trastorno pulmonar caracterizado por obstrucción progresiva e irreversible de las vías respiratorias. Tos crónica con mucosidad, falta de aire y sibilancias.',
                recommendation: '💊 Dejar de fumar (factor principal). Rehabilitación pulmonar, oxigenoterapia si es necesario. Vacunación contra influenza y neumococo. Control médico periódico cada 3 meses.'
            },
            'Hipertensión Pulmonar': {
                name: 'Hipertensión Pulmonar',
                icon: '❤️',
                desc: 'Aumento de la presión en las arterias de los pulmones. Causa dificultad para respirar, fatiga, mareos y dolor en el pecho.',
                recommendation: '💊 Tratamiento con vasodilatadores, oxígeno suplementario. Seguimiento con cardiólogo y neumólogo. Control de peso y actividad física moderada bajo supervisión médica.'
            }
        };
    }

    diagnosticar(answers) {
        const counts = {};
        const positiveSymptoms = [];

        for (const [qId, value] of Object.entries(answers)) {
            if (value === 1) {
                const question = MotorInferenciaRespiratorio.QUESTIONS.find(q => q.id === parseInt(qId));
                if (question) {
                    positiveSymptoms.push(question.text);
                    for (const disease of question.diseases) {
                        counts[disease] = (counts[disease] || 0) + 1;
                    }
                }
            }
        }

        let maxCount = 0;
        let selectedDisease = 'Enfermedad Respiratoria';

        for (const [disease, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                selectedDisease = disease;
            }
        }

        if (maxCount === 0) {
            selectedDisease = 'Enfermedad Respiratoria';
        }

        const info = MotorInferenciaRespiratorio.DISEASE_INFO[selectedDisease] ||
            MotorInferenciaRespiratorio.DISEASE_INFO['Enfermedad Respiratoria'];

        return {
            disease: selectedDisease,
            info: info,
            symptoms: positiveSymptoms,
            count: maxCount,
            total: Object.keys(answers).length
        };
    }
}

if (typeof window !== 'undefined') {
    window.MotorInferenciaRespiratorio = MotorInferenciaRespiratorio;
}