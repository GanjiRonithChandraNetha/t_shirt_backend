export const impDates = {
    REGISTRATION_START_DATE: process.env.REGISTRATION_START_DATE 
        ? new Date(process.env.REGISTRATION_START_DATE) 
        : new Date(2026, 2, 5),

    REGISTRATION_END_DATE: process.env.REGISTRATION_END_DATE 
        ? new Date(process.env.REGISTRATION_END_DATE) 
        : new Date(2026, 2, 8),

    VOTING_START_DATE: process.env.VOTING_START_DATE 
        ? new Date(process.env.VOTING_START_DATE) 
        : new Date(2026, 2, 9),

    VOTING_END_DATE: process.env.VOTING_END_DATE 
        ? new Date(process.env.VOTING_END_DATE) 
        : new Date(2026, 2, 12),
};