interface IMailConfig {
    driver: 'ethereal' | 'sas';
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'email@domain.com',
            name: 'name',
        },
    },
} as IMailConfig;
