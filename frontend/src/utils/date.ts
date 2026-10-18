// As datas de transação são dias de calendário: a API recebe "AAAA-MM-DD"
// e armazena como meia-noite UTC. Por isso a exibição usa UTC, evitando que
// o fuso local (ex.: UTC-3) mostre o dia anterior.

export function todayAsInputValue() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function toDateInputValue(isoDate: string) {
    return isoDate.slice(0, 10)
}

export function formatCalendarDate(isoDate: string) {
    return new Date(isoDate).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
    })
}
