import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { LOGO_URI } from './logo';

export const exportApplicationsToExcel = async (applications) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Admission Registry');

    // 1. Branding Layout Setup
    worksheet.mergeCells('A1:L1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'ALEXANDRIA HIGH SCHOOL - OFFICIAL ADMISSION REGISTRY';
    titleCell.font = { name: 'Arial Black', size: 18, color: { argb: 'FF003366' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A2:L2');
    const mottoCell = worksheet.getCell('A2');
    mottoCell.value = 'Honesty • Respect • Excellence';
    mottoCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF666666' } };
    mottoCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A3:L3');
    const timestampCell = worksheet.getCell('A3');
    timestampCell.value = `Report Generated: ${new Date().toLocaleString()}`;
    timestampCell.font = { name: 'Arial', size: 8, color: { argb: 'FF999999' } };
    timestampCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // 2. Insert Logo (if exists)
    if (LOGO_URI) {
        try {
            const logoId = workbook.addImage({
                base64: LOGO_URI,
                extension: 'png',
            });
            worksheet.addImage(logoId, {
                tl: { col: 0, row: 0 },
                ext: { width: 60, height: 60 },
                editAs: 'oneCell'
            });
        } catch (e) { console.error("Excel logo error", e); }
    }

    // 3. Header Row (Row 5)
    const headerRow = worksheet.getRow(5);
    headerRow.values = [
        'Reference #', 
        'Status', 
        'Applied Date', 
        'Learner Name', 
        'Grade', 
        'ID Number', 
        'Parent/Guardian', 
        'Email', 
        'Contact', 
        'City/Suburb', 
        'Current School', 
        'Emergency'
    ];
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // 4. Data Population
    applications.forEach((app, i) => {
        const row = worksheet.addRow([
            app.reference_number,
            app.status.toUpperCase(),
            new Date(app.created_at).toLocaleDateString(),
            `${app.learner_first_name} ${app.learner_surname}`.toUpperCase(),
            `GR ${app.grade_applying_for}`,
            app.id_number || 'N/A',
            app.parent_primary_name,
            app.parent_primary_email,
            app.parent_primary_contact,
            `${app.address_suburb}, ${app.address_city}`,
            app.current_school_name,
            `${app.emergency_contact_name} (${app.emergency_contact_number})`
        ]);

        // Alternating row colors for office legibility
        if (i % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF9FAFB' }
            };
        }

        row.font = { size: 9 };
        row.alignment = { vertical: 'middle' };
        row.height = 20;

        // Status coloring
        const statusCell = row.getCell(2);
        if (app.status === 'Accepted') statusCell.font = { color: { argb: 'FF059669' }, bold: true };
        if (app.status === 'Rejected') statusCell.font = { color: { argb: 'FFDC2626' }, bold: true };
        if (app.status === 'Waitlisted') statusCell.font = { color: { argb: 'FFD97706' }, bold: true };
    });

    // 5. Professional Formatting (Column Widths)
    worksheet.columns = [
        { width: 18 }, // Ref
        { width: 14 }, // Status
        { width: 14 }, // Date
        { width: 30 }, // Learner Name
        { width: 10 }, // Grade
        { width: 22 }, // ID Number
        { width: 25 }, // Parent
        { width: 30 }, // Email
        { width: 18 }, // Contact
        { width: 25 }, // City
        { width: 30 }, // Current School
        { width: 30 }, // Emergency
    ];

    // 6. Freeze Header and Branding
    worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 5 }
    ];

    // 7. Executive Metadata
    workbook.creator = 'Alexandria Apex OS';
    workbook.lastModifiedBy = 'Administrative Office';
    workbook.created = new Date();

    // 8. Generate and Save File
    const buffer = await workbook.xlsx.writeBuffer();
    const fileTimestamp = new Date().toISOString().split('T')[0];
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Alexandria_High_Registry_${fileTimestamp}.xlsx`);
};
