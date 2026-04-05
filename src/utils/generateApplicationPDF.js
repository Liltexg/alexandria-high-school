import { jsPDF } from 'jspdf';
import { LOGO_URI } from './logo';

export const generateApplicationPDF = async (formData, referenceNumber) => {
    const doc = jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);

    // Helper functions
    const drawSectionHeader = (text, y) => {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.rect(margin, y, contentWidth, 6, 'S');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(text, pageWidth / 2, y + 4.5, { align: 'center' });
    };

    const drawGridCell = (x, y, w, h, label, value, bold = false) => {
        doc.setLineWidth(0.2);
        doc.rect(x, y, w, h, 'S');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x + 1, y + 3);

        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(8);
        const valText = value ? String(value) : '';
        // Use left alignment with 3mm indent to avoid right border overlap
        doc.text(valText, x + 5, y + (h - 2));
    };

    const drawCheckboxes = (x, y, label, options, selectedValue) => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x, y);

        let currentX = x + 30;
        options.forEach(opt => {
            const isSelected = String(selectedValue).toLowerCase() === String(opt.value).toLowerCase();
            doc.rect(currentX, y - 3, 4, 4, 'S');
            if (isSelected) {
                doc.line(currentX, y - 3, currentX + 4, y + 1);
                doc.line(currentX + 4, y - 3, currentX, y + 1);
            }
            doc.setFont('helvetica', 'normal');
            doc.text(opt.label, currentX + 5, y);
            currentX += 25;
        });
    };

    // --- Page 1 ---

    // Header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Alexandria High School', margin, 15);
    doc.setFont('helvetica', 'normal');
    doc.text('P. O. Box 43', margin, 19);
    doc.text('ALEXANDRIA', margin, 23);
    doc.text('6185', margin, 27);
    doc.text('Cell: 063 652 0546', margin, 31);

    doc.setFont('helvetica', 'bold');
    doc.text('Hoërskool Alexandria', pageWidth - margin - 35, 15, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Posbus 43', pageWidth - margin - 35, 19);
    doc.text('ALEXANDRIA', pageWidth - margin - 35, 23);
    doc.text('6185', pageWidth - margin - 35, 27);
    doc.setFontSize(8);
    doc.text('E-mail Addresses:', pageWidth - margin - 35, 31);
    doc.setTextColor(0, 0, 255);
    doc.text('alexandriahigh6185@gmail.com', pageWidth - margin - 45, 35);
    doc.setTextColor(0);

    // Logo
    if (LOGO_URI) {
        try {
            // center the logo. Assuming square-ish logo, 25x25mm
            doc.addImage(LOGO_URI, 'PNG', (pageWidth / 2) - 12.5, 10, 25, 25);
        } catch (e) {
            console.error("Error adding logo to PDF", e);
            doc.setDrawColor(0);
            doc.circle(pageWidth / 2, 22, 12, 'S');
            doc.setFontSize(6);
            doc.text('LOGO', pageWidth / 2, 23, { align: 'center' });
        }
    } else {
        doc.setDrawColor(0);
        doc.circle(pageWidth / 2, 22, 12, 'S');
        doc.setFontSize(6);
        doc.text('LOGO', pageWidth / 2, 23, { align: 'center' });
    }

    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION FOR ADMISSION TO SCHOOL / AANSOEK OM TOELATING TOT SKOOL', pageWidth / 2, 48, { align: 'center' });
    doc.text(`YEAR / JAAR: 20${formData.intake_year.toString().slice(-2)}`, pageWidth / 2, 53, { align: 'center' });

    // Office Use Only
    let currentY = 58;
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 18);
    doc.setFontSize(8);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, contentWidth, 4, 'F');
    doc.text('FOR OFFICE USE ONLY / SLEGS VIR KANTOORGEBRUIK', pageWidth / 2, currentY + 3, { align: 'center' });

    doc.line(margin + 45, currentY + 4, margin + 45, currentY + 18);
    doc.line(margin + 90, currentY + 4, margin + 90, currentY + 18);
    doc.line(margin, currentY + 11, margin + 90, currentY + 11);

    doc.setFontSize(7);
    doc.text('Accepted / Aanvaar:', margin + 1, currentY + 7);
    doc.text('Date accepted / Datum aanvaar:', margin + 46, currentY + 7);
    doc.text('Admission No. / Toelatingsnr.:', margin + 91, currentY + 7);
    doc.text('Not accepted / Nie aanvaar:', margin + 1, currentY + 14);
    doc.text('Reason for not being accepted / Rede vir nie aanvaarding:', margin + 46, currentY + 14);

    currentY += 22;

    // Notice text
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.text('NOTE: This form must be completed in full. All changes to be initialed or signed by parent / guardian. Completing the form does not necessarily mean', margin, currentY);
    doc.text('that the learner has been accepted into the school. Please provide us with a working telephone number. We cannot be held liable for contact details', margin, currentY + 3);
    doc.text('that are incorrect.', margin, currentY + 6);

    doc.text('NOTA: Hierdie vorm moet volledig ingevul word. By alle veranderinge moet daar geparafeer of geteken word deur die ouer / voog. Deur die vorm in te', margin, currentY + 10);
    doc.text('vul, beteken dit nie noodwendig dat die leerder tot die skool toegelaat is nie. Verskaf asseblief \'n werkende telefoonnommer. Ons kan nie aanspreeklik', margin, currentY + 13);
    doc.text('gehou word vir kontakbesonderhede wat verkeerd is nie.', margin, currentY + 16);

    currentY += 22;

    // LEARNER INFORMATION
    drawSectionHeader('LEARNER INFORMATION:', currentY);
    currentY += 6;

    drawGridCell(margin, currentY, 110, 8, 'Grade applied for / Graad waarvoor aansoek gedoen word:', formData.grade_applying_for);
    drawGridCell(margin + 110, currentY, 80, 8, 'Ref / Verw:', referenceNumber, true);
    currentY += 8;

    drawGridCell(margin, currentY, 130, 8, 'Home Language / Huistaal:', formData.home_language);
    drawGridCell(margin + 130, currentY, 60, 8, 'Year Passed / Jaar geslaag:', formData.intake_year - 1);
    currentY += 8;

    // Preferred language
    doc.rect(margin, currentY, contentWidth, 8);
    doc.setFontSize(7);
    doc.text('Preferred Language of Instruction / Taal waarin onderrig verkies word:', margin + 1, currentY + 5);
    drawCheckboxes(margin + 120, currentY + 5, '', [
        { label: 'Afrikaans', value: 'Afrikaans' },
        { label: 'English', value: 'English' }
    ], formData.preferred_language);
    currentY += 8;

    // Boarder
    doc.rect(margin, currentY, contentWidth, 8);
    doc.text('Boarder / Koshuisleerder:', margin + 1, currentY + 5);
    drawCheckboxes(margin + 120, currentY + 5, '', [
        { label: 'Yes / Ja', value: 'true' },
        { label: 'No / Nee', value: 'false' }
    ], String(formData.is_boarder));
    currentY += 8;

    drawGridCell(margin, currentY, 130, 10, 'Surname / Van:', formData.learner_surname, true);
    drawGridCell(margin + 130, currentY, 60, 10, 'Date of Birth / Geboortedatum:', formData.date_of_birth);
    currentY += 10;

    drawGridCell(margin, currentY, 130, 10, 'First Name / Geboortenaam:', formData.learner_first_name);
    drawGridCell(margin + 130, currentY, 60, 10, 'ID Number / ID Nommer:', formData.id_number);
    currentY += 10;

    // Gender
    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Gender / Geslag:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 60, currentY + 6, '', [
        { label: 'Male / Manlik', value: 'Male' },
        { label: 'Female / Vroulik', value: 'Female' }
    ], formData.gender);
    currentY += 10;

    drawGridCell(margin, currentY, 60, 10, 'Citizenship / Burgerskap:', formData.citizenship);
    drawGridCell(margin + 60, currentY, 60, 10, 'Province / Provinsie:', formData.address_province);
    drawGridCell(margin + 120, currentY, 70, 10, 'Race / Ras:', formData.race);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Physical Address / Woonadres:', `${formData.address_street}, ${formData.address_suburb}, ${formData.address_city}, ${formData.address_postal_code}`);
    currentY += 10;

    // Deceased parents
    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Deceased Parents / Ouers Oorlede:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 50, currentY + 6, '', [
        { label: 'Mother', value: 'Mother' },
        { label: 'Father', value: 'Father' },
        { label: 'Both', value: 'Both' },
        { label: 'None', value: 'None' }
    ], formData.deceased_parent);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Religion / Geloof:', formData.religion);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Mode of transport / Metode van vervoer na skool:', formData.mode_of_transport);
    currentY += 12;

    drawSectionHeader('Previous school information / Besonderhede van vorige skool:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, contentWidth, 10, 'Name of previous school / Naam van vorige skool:', formData.current_school_name);
    currentY += 10;
    drawGridCell(margin, currentY, contentWidth, 10, 'Previous school address / Adres van vorige skool:', formData.current_school_address);
    currentY += 12;

    drawSectionHeader('Learner medical information / Mediese inligting van leerder:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, 95, 10, 'Medical aid no. / Mediesefonds nr.:', formData.medical_aid_number);
    drawGridCell(margin + 95, currentY, 95, 10, 'Medical aid name / Naam van mediesefonds:', formData.medical_aid_name);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 8, 'Main member / Hooflid:', formData.medical_main_member);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Doctor name / Naam van dokter:', formData.doctor_name);
    drawGridCell(margin + 95, currentY, 95, 8, 'Doctor tel no. / Telefoonnr. van dokter:', formData.doctor_contact);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 10, 'Medical condition / Mediese toestand:', formData.medical_condition);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Special problems requiring counselling / Spesiale probleem wat berading benodig:', formData.special_problems);
    currentY += 10;

    // Dexterity
    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Dexterity of learner / Behendigheid van leerder:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 60, currentY + 6, '', [
        { label: 'Right handed', value: 'Right' },
        { label: 'Left handed', value: 'Left' },
        { label: 'Ambidextrous', value: 'Ambidextrous' }
    ], formData.dexterity);

    currentY += 15;
    doc.setFontSize(6);
    doc.text('1', pageWidth / 2, 290);

    // --- Page 2 ---
    doc.addPage();
    currentY = margin + 5;

    drawSectionHeader('Siblings / Gesin:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, 95, 10, 'No. of other children at this school:', '');
    drawGridCell(margin + 95, currentY, 95, 10, 'Position in the family (e.g. first):', '');
    currentY += 10;

    doc.rect(margin, currentY, contentWidth, 15);
    doc.setFontSize(7);
    doc.text('Please supply full names below / Verskaf asb. Volledige name hieronder:', margin + 1, currentY + 4);
    doc.setFontSize(6);
    doc.text(formData.siblings_info || 'None', margin + 5, currentY + 10);
    currentY += 18;

    // Parent 1
    drawSectionHeader('PARENT/GUARDIAN INFORMATION / OUER/VOOG INLIGTING:', currentY);
    currentY += 6;

    doc.rect(margin, currentY, contentWidth, 8);
    drawCheckboxes(margin + 1, currentY + 5, 'Indicate / Dui aan:', [
        { label: 'Mother / Ma', value: 'Mother' },
        { label: 'Father / Pa', value: 'Father' },
        { label: 'Guardian / Voog', value: 'Guardian' }
    ], formData.parent_primary_relationship);
    currentY += 8;

    drawGridCell(margin, currentY, 30, 8, 'Title / Titel:', formData.parent_primary_title);
    drawGridCell(margin + 30, currentY, 60, 8, 'Initials / Voorletters:', '');
    drawGridCell(margin + 90, currentY, 100, 8, 'Surname / Van:', formData.parent_primary_surname);
    currentY += 8;

    drawGridCell(margin, currentY, 130, 8, 'First Name / Voorname:', formData.parent_primary_name);
    drawGridCell(margin + 130, currentY, 60, 8, 'Gender / Geslag:', formData.parent_primary_gender || 'Select');
    currentY += 8;

    drawGridCell(margin, currentY, 110, 8, 'Home Language / Huistaal:', formData.home_language);
    drawGridCell(margin + 110, currentY, 80, 8, 'Race / Ras:', formData.race);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 8, 'ID or Passport No. / ID of Paspoort Nr.:', formData.parent_primary_id);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 8, 'Postal Address / Posadres:', '');
    currentY += 8;

    drawGridCell(margin, currentY, 140, 8, 'City/Suburb / Stad/Woonbuurt:', formData.address_suburb);
    drawGridCell(margin + 140, currentY, 50, 8, 'Postal Code:', formData.address_postal_code);
    currentY += 8;

    drawGridCell(margin, currentY, 60, 8, 'Home Telephone:', '');
    drawGridCell(margin + 60, currentY, 60, 8, 'Work Telephone:', '');
    drawGridCell(margin + 120, currentY, 70, 8, 'Cellphone:', formData.parent_primary_contact);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Occupation / Beroep:', formData.parent_primary_occupation);
    drawGridCell(margin + 95, currentY, 95, 8, 'Employer / Werkgewer:', formData.parent_primary_employer);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Marital Status:', formData.parent_primary_marital_status);
    drawGridCell(margin + 95, currentY, 95, 8, 'Relationship to Learner:', formData.parent_primary_relationship);
    currentY += 12;

    // Parent 2
    doc.rect(margin, currentY, contentWidth, 8);
    drawCheckboxes(margin + 1, currentY + 5, 'Indicate / Dui aan:', [
        { label: 'Mother / Ma', value: 'Mother' },
        { label: 'Father / Pa', value: 'Father' },
        { label: 'Guardian / Voog', value: 'Guardian' }
    ], formData.parent_secondary_relationship);
    currentY += 8;

    drawGridCell(margin, currentY, 30, 8, 'Title / Titel:', formData.parent_secondary_title);
    drawGridCell(margin + 30, currentY, 60, 8, 'Initials / Voorletters:', '');
    drawGridCell(margin + 90, currentY, 100, 8, 'Surname / Van:', formData.parent_secondary_surname);
    currentY += 8;

    drawGridCell(margin, currentY, 130, 8, 'First Name / Voorname:', formData.parent_secondary_name);
    drawGridCell(margin + 130, currentY, 60, 8, 'Gender / Geslag:', formData.parent_secondary_gender || 'Select');
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 8, 'ID or Passport No. / ID of Paspoort Nr.:', formData.parent_secondary_id_number);
    currentY += 8;

    drawGridCell(margin, currentY, 140, 8, 'City/Suburb / Stad/Woonbuurt:', '');
    drawGridCell(margin + 140, currentY, 50, 8, 'Postal Code:', '');
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Occupation / Beroep:', formData.parent_secondary_occupation);
    drawGridCell(margin + 95, currentY, 95, 8, 'Employer / Werkgewer:', formData.parent_secondary_employer);
    currentY += 15;

    // Declaration
    doc.setFontSize(8);
    doc.text('I hereby declare that to the best of my knowledge, the above information as supplied is accurate and correct.', margin, currentY);
    doc.text('Hiermee verklaar ek dat sover my kennis strek, die bogenoemde inligting wat verskaf is, akkuraat en korrek is.', margin, currentY + 4);

    currentY += 10;
    doc.text('Name of Parent/Guardian / Naam van Ouer/Voog:', margin, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.parent_primary_name + ' ' + formData.parent_primary_surname, 80, currentY - 1);
    doc.line(80, currentY, 180, currentY);

    currentY += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Name of Learner / Naam van Leerder:', margin, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.learner_first_name + ' ' + formData.learner_surname, 80, currentY - 1);
    doc.line(80, currentY, 180, currentY);

    currentY += 15;
    doc.setFont('helvetica', 'normal');
    if (formData.parent_signature) {
        try {
            const imgEl = new window.Image();
            imgEl.src = formData.parent_signature;
            await new Promise((resolve, reject) => {
                imgEl.onload = resolve;
                imgEl.onerror = reject;
            });
            const canvas = document.createElement('canvas');
            canvas.width = imgEl.width || 400;
            canvas.height = imgEl.height || 150;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgEl, 0, 0);
            const safeJpeg = canvas.toDataURL('image/jpeg', 1.0);
            doc.addImage(safeJpeg, 'JPEG', 110, currentY - 10, 50, 15);
        } catch (e) {
            console.error("Parent sig error", e);
        }
    }
    doc.text('Signature of Parent/Guardian / Handtekening van Ouer/Voog:', margin, currentY);
    doc.line(95, currentY, 180, currentY);

    currentY += 15;

    currentY += 10;
    doc.text('Date:', margin, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date().toLocaleDateString(), 20, currentY - 1);
    doc.line(20, currentY, 80, currentY);

    currentY += 10;
    drawSectionHeader('Documentation attached (Please mark):', currentY);
    currentY += 10;

    const checklist = [
        '1. Birth Certificate / Geboortesertifikaat:',
        '2. Progress report from previous school / Vorderingsverslag:',
        '3. Immunisation record / Inentingsertifikaat:',
        '4. Proof of Address / Bewys van Adres:',
        '5. ID Copies of Parents/Guardians / ID Kopieë:',
        '6. If Guardian (Court Documents) / Indien Voog:',
        '7. Provisional Transfer letter / Voorlopige Oordragbrief:'
    ];

    checklist.forEach((item, i) => {
        doc.setFontSize(8);
        const itemY = currentY + (i * 8);
        doc.text(item, margin + 5, itemY);
        doc.rect(160, itemY - 4, 10, 6, 'S');
    });

    doc.setFontSize(6);
    doc.text('2', pageWidth / 2, 290);

    doc.save(`Alexandria_High_School_Application_${referenceNumber}.pdf`);
};
