export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const fields = body.fields || [];

    // Récupère les valeurs des champs Tally
    const getValue = (label) => {
      const field = fields.find(f => 
        f.label && f.label.toLowerCase().includes(label.toLowerCase())
      );
      return field?.value || '';
    };

    const nom = getValue('nom');
    const prenom = getValue('prénom');
    const telephone = getValue('téléphone');
    const mail = getValue('email');
    const source = body.formName || 'inconnu';

    // Envoie les données à Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/prospects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ nom, prenom, telephone, mail, source })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
