import {
  Antecedent,
  createCros,
  createRpe,
  Cros,
  Disease,
  Hospital,
  Medic,
  MedicalRecord,
  Patient,
  Rpe,
  VitalSign
} from '@/models'
import { generateReport } from '@/reports'
import { PdfOutput } from '@/reports'
import { header } from '@/reports'
import { table } from '@/reports'
import { StyleDictionary, TableCell } from 'pdfmake/interfaces'

export function MedRecReport(
  mode: PdfOutput = 'open',
  hospital: Hospital,
  medRec: MedicalRecord,
  medic: Medic,
  patient: Patient,
  vitalSign: VitalSign,
  antecedent: Antecedent,
  diseases: Disease[]
) {
  generateReport(
    {
      header: header(hospital),
      content: [
        patientTable(patient, medRec.id),
        { text: '_', style: 'space' },
        reasonTable(medRec.reason),
        { text: '_', style: 'space' },
        personalBackgroundTable(antecedent),
        { text: '_', style: 'space' },
        familyBackgroundTable(antecedent.family),
        { text: '_', style: 'space' },
        illnessTable(medRec),
        { text: '_', style: 'space' },
        crosTable(medRec.cros || createCros()),
        { text: '_', style: 'space' },
        vitalSignTable(vitalSign),
        { text: '_', style: 'space' },
        rpeTable(medRec.rpe || createRpe()),
        { text: '_', style: 'space' },
        diagnosticsTable(diseases),
        { text: '_', style: 'space' },
        medicTable(medRec, medic)
      ],
      styles: style()
    },
    mode
  )
}

function patientTable(p: Patient, n: number) {
  return table({
    body: [
      [
        { text: 'NOMBRE', style: 'thead' },
        { text: 'APELLIDO', style: 'thead' },
        { text: 'SEXO', style: 'thead' },
        { text: 'NÚMERO DE HOJA', style: 'thead' },
        { text: 'HISTORIA CLINICA', style: 'thead' }
      ],
      [
        { text: p.firstName, style: 'tcell' },
        { text: p.lastName, style: 'tcell' },
        { text: `${p.sex}`.toUpperCase(), style: 'tcell' },
        { text: n, style: 'tcell' },
        { text: p.hc, style: 'tcell' }
      ]
    ],
    widths: ['*', '*', 'auto', 'auto', 'auto']
  })
}
function reasonTable(reason: string) {
  return table({
    body: [
      [{ text: '1. MOTIVO DE CONSULTA', style: 'cellHeader' }],
      [{ text: reason, style: 'tcell' }]
    ],
    widths: ['*']
  })
}
function personalBackgroundTable(antecedent: Antecedent) {
  let antecedents: TableCell[][] = [
    [{ text: '2. ANTECEDENTES PERSONALES', style: 'cellHeader' }]
  ]
  if (antecedent.personal) {
    antecedents.push([{ text: `PERSONAL: ${antecedent.personal}`, style: 'tcell' }])
  }
  if (antecedent.surgical) {
    antecedents.push([{ text: `QUIRÚRGICO: ${antecedent.surgical}`, style: 'tcell' }])
  }

  if (antecedent.professional) {
    antecedents.push([
      { text: `PROFESIONAL: ${antecedent.professional}`, style: 'tcell' }
    ])
  }
  if (antecedent.habits) {
    antecedents.push([{ text: `HÁBITOS: ${antecedent.habits}`, style: 'tcell' }])
  }
  if (antecedent.clinician) {
    antecedents.push([{ text: `CLÍNICOS: ${antecedent.clinician}`, style: 'tcell' }])
  }
  if (antecedent.trauma) {
    antecedents.push([{ text: `TRAUMÁTICOS: ${antecedent.trauma}`, style: 'tcell' }])
  }
  if (antecedent.allergy) {
    antecedents.push([{ text: `ALÉRGICOS: ${antecedent.allergy}`, style: 'tcell' }])
  }
  if (antecedent.ago) {
    antecedents.push([{ text: `AGO: ${antecedent.ago}`, style: 'tcell' }])
  }
  return table({
    body: antecedents,
    widths: ['*']
  })
}
function familyBackgroundTable(antecenent?: string) {
  return table({
    body: [
      [{ text: '3. ANTECEDENTES FAMILIARES', style: 'cellHeader' }],
      [{ text: `${antecenent ? antecenent : ''}`, style: 'tcell' }]
    ],
    widths: ['*']
  })
}
function illnessTable(medRec: MedicalRecord) {
  return table({
    body: [
      [{ text: '4. ENFERMEDAD O PROBLEMA ACTUAL', style: 'cellHeader' }],
      [{ text: medRec.currentIllness || '', style: 'tcell' }]
    ],
    widths: ['*']
  })
}
function crosTable(cros: Cros) {
  return table({
    body: [
      [
        {
          colSpan: 10,
          text: '5. REVISIÓN ACTUAL DE ÓRGANOS Y SISTEMAS',
          style: 'cellHeader'
        },
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      [
        { text: '1 ÓRGANOS DE LOS SENTIDOS', style: 'tcellTitle' },
        { text: `${cros.senseOrgans ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '3 CÁRDIO VASCULAR', style: 'tcellTitle' },
        { text: `${cros.cardiovascular ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '5 GENITAL', style: 'tcellTitle' },
        { text: `${cros.genital ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '7 MÚSCULO ESQUELÉTICO', style: 'tcellTitle' },
        { text: `${cros.skeletalMuscle ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '9 HEMO LINFÁTICO', style: 'tcellTitle' },
        { text: `${cros.lymphaticHeme ? 'CP' : 'SP'}`, style: 'tcell' }
      ],
      [
        { text: '2 RESPIRATORIO', style: 'tcellTitle' },
        { text: `${cros.respiratory ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '4 DIGESTIVO', style: 'tcellTitle' },
        { text: `${cros.digestive ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '6 URINARIO', style: 'tcellTitle' },
        { text: `${cros.urinary ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '8 ENDÓCRINO', style: 'tcellTitle' },
        { text: `${cros.endocrine ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '10 NERVIOSO', style: 'tcellTitle' },
        { text: `${cros.nervous ? 'CP' : 'SP'}`, style: 'tcell' }
      ]
    ],
    widths: ['*', 'auto', '*', 'auto', '*', 'auto', '*', 'auto', '*', 'auto']
  })
}
function vitalSignTable(vs: VitalSign) {
  return table({
    body: [
      [
        { colSpan: 7, text: '6. SIGNOS VITALES Y ANTROPOMETRÍA', style: 'cellHeader' },
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      [
        { text: 'FECHA', style: 'tcellTitle' },
        { text: 'TEMPERATURA', style: 'tcellTitle' },
        { text: 'PRESIÓN ARTERIAL', style: 'tcellTitle' },
        { text: 'PULSO/MIN', style: 'tcellTitle' },
        { text: 'FRECUENCIA RESPIRATORIA', style: 'tcellTitle' },
        { text: 'PESO', style: 'tcellTitle' },
        { text: 'TALLA', style: 'tcellTitle' }
      ],
      [
        { text: `${vs.createdAt}`, style: 'tcell' },
        { text: `${vs.temperature}°C`, style: 'tcell' },
        { text: `${vs.systolicPressure}`, style: 'tcell' },
        { text: `${vs.pulse}`, style: 'tcell' },
        { text: `${vs.breathingFrequency}`, style: 'tcell' },
        { text: `${vs.weight}Kg`, style: 'tcell' },
        { text: `${vs.tall}cm`, style: 'tcell' }
      ]
    ],
    widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto']
  })
}
function rpeTable(rpe: Rpe) {
  return table({
    body: [
      [
        { colSpan: 12, text: '7. EXAMEN FÍSICO REGIONAL', style: 'cellHeader' },
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      [
        { text: '1 CABEZA', style: 'tcellTitle' },
        { text: `${rpe.head ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '2 CUELLO', style: 'tcellTitle' },
        { text: `${rpe.neck ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '3 TÓRAX', style: 'tcellTitle' },
        { text: `${rpe.chest ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '4 ABDÓMEN', style: 'tcellTitle' },
        { text: `${rpe.abdomen ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '5 PELVIS', style: 'tcellTitle' },
        { text: `${rpe.pelvis ? 'CP' : 'SP'}`, style: 'tcell' },
        { text: '6 EXTREMIDADES', style: 'tcellTitle' },
        { text: `${rpe.extremities ? 'CP' : 'SP'}`, style: 'tcell' }
      ]
    ],
    widths: [
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      '*',
      'auto'
    ]
  })
}
function diagnosticsTable(diseases: Disease[]) {
  let list: TableCell[][] = [[{ text: '8. DIAGNÓSTICO', style: 'cellHeader' }]]
  for (let index = 0; index < diseases.length; index++) {
    list.push([{ text: diseases[index].name || '', style: 'tcell' }])
  }
  return table({
    body: list,
    widths: ['*']
  })
}

function medicTable(medRec: MedicalRecord, medic: Medic) {
  return table({
    body: [
      [
        { text: 'FECHA', style: 'tcellTitle' },
        { text: medRec.createdAt, style: 'tcell' },
        { text: 'Medico', style: 'tcellTitle' },
        { text: `${medic.lastName} ${medic.firstName}`.toUpperCase(), style: 'tcell' },
        { text: 'FIRMA', style: 'tcellTitle' },
        { text: '', style: 'tcell' }
      ]
    ],
    widths: ['auto', 'auto', 'auto', '*', 'auto', 100]
  })
}

export function style(): StyleDictionary {
  return {
    space: { fontSize: 10, color: '#ffffff' },
    cellHeader: {
      fontSize: 12,
      color: '#da2a1d',
      fillColor: '#F6b6A9',
      bold: true
    },
    thead: {
      alignment: 'center',
      color: '#da2a1d',
      fillColor: '#F6b6A9',
      bold: true,
      margin: [0, 1],
      fontSize: 10
    },
    tcell: {
      margin: [0, 1],
      fontSize: 10
    },
    tcellTitle: {
      margin: [0, 1],
      fontSize: 10,
      color: '#da2a1d',
      bold: true
    }
  }
}
