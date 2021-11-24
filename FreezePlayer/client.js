RegisterCommand('freeze', (x, y, msg) => {
    const args = msg.slice(7).split(' ');
    const targetPlayerId = args[0];
    emitNet('disky:freeze', targetPlayerId);
});

RegisterCommand('unfreeze', (x, y, msg) => {
    const args = msg.slice(9).split(' ');
    const targetPlayerId = args[0];
    emitNet('disky:unfreeze', targetPlayerId);
});