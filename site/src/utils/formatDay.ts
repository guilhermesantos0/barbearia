export const formatDay = (date: Date | string) => {

    const months = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Agosto', 'Novembro', 'Dezembro' ];

    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) return 'Data inválida';

    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()]
    const year = d.getFullYear();

    return `${day} de ${month} de ${year}`
}