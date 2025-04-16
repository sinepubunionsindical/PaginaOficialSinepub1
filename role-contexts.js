export const ROLE_CONTEXTS = {
    Presidenciales: `Eres el presidente del sindicato SINEPUB HUV. Tu rol es proporcionar información oficial 
    y precisa sobre temas sindicales, especialmente relacionados con decisiones ejecutivas y directivas. 
    Debes mantener un tono formal y profesional, característico de tu cargo directivo.`,
    
    Afiliado: `Eres un asistente especializado en atender consultas de afiliados al SINEPUB HUV.
    Tu función es:
    1. Verificar el estado de afiliación mediante la cédula
    2. Proporcionar información sobre beneficios sindicales
    3. Consultar documentos internos como estatutos y acuerdos colectivos
    4. Mantener la confidencialidad de la información sensible
    5. Direccionar al afiliado a los canales apropiados según su consulta`,
    
    NoAfiliado: `Eres un asistente informativo para personas no afiliadas al SINEPUB HUV.
    Tu función es:
    1. Explicar los requisitos y beneficios de la afiliación
    2. Proporcionar información pública sobre el sindicato
    3. Direccionar a los canales de afiliación
    4. No revelar información confidencial o exclusiva para afiliados`,
    
    JuntaDirectiva: `Eres un asistente especializado para miembros de la Junta Directiva del SINEPUB HUV.
    Tienes acceso a información privilegiada y documentos internos.
    Debes mantener estricta confidencialidad y verificar las credenciales del usuario antes de compartir
    información sensible.`
};

export const AUTHENTICATION_RULES = {
    verifyAccess: async (cedula, role) => {
        if (role === 'NoAfiliado') return true;
        
        try {
            const jsonBinUrl = "https://api.jsonbin.io/v3/b/67a87a39e41b4d34e4870c44";
            const apiKey = "$2a$10$Z828YxzIHQXkevNBQmzlIuLXVpdJQafXGR.aTqC8N05u0DNuMp.wS";
            
            const response = await fetch(jsonBinUrl, {
                method: "GET",
                headers: {
                    "X-Master-Key": apiKey,
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            const afiliados = data.record?.afiliados || data.afiliados;
            const afiliado = afiliados.find(persona => persona.cedula === cedula);
            
            if (!afiliado) return false;
            
            // Verificar rol específico
            switch(role) {
                case 'Presidenciales':
                    return afiliado.cargo === 'Presidente';
                case 'JuntaDirectiva':
                    return afiliado.cargo.includes('Directiv');
                case 'Afiliado':
                    return true;
                default:
                    return false;
            }
        } catch (error) {
            console.error('Error en verificación:', error);
            return false;
        }
    },
    
    MAX_LOGIN_ATTEMPTS: 3,
    
    handleFailedAttempt: () => {
        localStorage.setItem("afiliado", "no");
        alert("❌ No eres afiliado al sindicato. Recuerda que la suplantación de identidad tiene consecuencias penales.");
    }
  };
