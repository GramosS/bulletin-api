# 📣 bulletin-API – Express + PostgreSQL

Detta projekt är en enkel anslagstavla där användare kan:

- Skapa konton
- Skapa kanaler
- Gå med i kanaler
- Skriva meddelanden i kanaler de är medlemmar i
- Se meddelanden från kanaler de är med i

---

## Teknik som används

- Node.js / Express
- PostgreSQL (med pgAdmin)
- Thunder Client (i VS Code) för API-testning

---

## Kom igång

### Klona och starta API:t:

```bash
git clone https://github.com/GramosS/bulletin-api.git
cd bulletin-api
npm install
node index.js
Se till att du har en PostgreSQL-databas med följande tabeller:

users – användare

channels – kanaler

members – koppling mellan användare och kanaler (många-till-många)

posts – meddelanden


Endpoints

➕ POST /users

Skapa en ny användare

json - body
{
  "username": "emma",
  "email": "emma@example.com"
}
➕ POST /channels
Skapa en ny kanal

json - body

{
  "name": "Filmklubben",
  "owner_id": 1
}
➕ POST /messages
Skicka ett meddelande (om användaren är medlem i kanalen)

json - body

{
  "content": "Hej alla!",
  "user_id": 1,
  "channel_id": 2
}

GET /users/:id/channels
Lista alla kanaler som en användare är med i


GET /channels/:id/messages
Hämta alla meddelanden i en kanal


Testning

Alla endpoints testades med Thunder Client 

Alla svar returnerar JSON med korrekt statuskod
