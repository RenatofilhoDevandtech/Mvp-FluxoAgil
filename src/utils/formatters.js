export const formatDate = (dateString, format = "dd/mmm/yyyy") => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "Data Inválida";

    try {
        let adjustedDate = new Date(dateString);

        if (typeof dateString === 'string' && dateString.length === 10 && dateString.includes('-')) {
            const [year, month, day] = dateString.split('-').map(Number);
            adjustedDate = new Date(Date.UTC(year, month - 1, day));
        }

        const options = {};
        if (format.includes("dd")) options.day = '2-digit';
        if (format.includes("mmm")) options.month = 'short';
        if (format.includes("MM")) options.month = '2-digit';
        if (format.includes("yyyy")) options.year = 'numeric';
        if (format.includes("yy")) options.year = '2-digit';
        if (format.includes("HH:mm")) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = false;
        }

        let locale = 'pt-BR';

        if (format === "mmm/yy") {
            return adjustedDate.toLocaleDateString(locale, { month: 'short', year: '2-digit' }).replace('.', '');
        }
        if (format === "yyyy-MM") {
            return `${adjustedDate.getUTCFullYear()}-${(adjustedDate.getUTCMonth() + 1).toString().padStart(2, '0')}`;
        }
        if (format === "datetime-local") {
            adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());
            return adjustedDate.toISOString().slice(0, 16);
        }

        return adjustedDate.toLocaleDateString(locale, options);
    } catch (err) {
        console.error("Erro ao formatar a data:", dateString, format, err);
        return "Data Inválida";
    }
};

export const dateDiffInDays = (dateStr1, dateStr2) => {
    if (!dateStr1 || !dateStr2 || isNaN(new Date(dateStr1).getTime()) || isNaN(new Date(dateStr2).getTime())) return NaN;

    try {
        const d1 = new Date(dateStr1).getTime();
        const d2 = new Date(dateStr2).getTime();
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    } catch (err) {
        console.error("Erro ao calcular diferença de datas:", dateStr1, dateStr2, err);
        return NaN;
    }
};
