export type PrinterProfile = {
  name: string;
  escposDevice: string;
  zplDevice: string;
};

export const config = {
  httpPort: Number(process.env.PRINT_AGENT_HTTP_PORT) || 4100,
  wsPort: Number(process.env.PRINT_AGENT_WS_PORT) || 4101,
  defaultProfile: process.env.PRINT_AGENT_PRINTER_PROFILE || 'default',
  profiles: {
    default: {
      name: 'Default',
      escposDevice: 'USB:default',
      zplDevice: 'USB:label',
    } as PrinterProfile,
  },
};


