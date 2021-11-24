// "client" = person/player that ran the command

onNet('disky:freeze', (targetPlayerId) => {
    if(IsPlayerAceAllowed(source, 'disky.freeze')){ // permissions
        const playerName = GetPlayerName(targetPlayerId);  // target's name
        const ped = GetPlayerPed(targetPlayerId); // target's ped
        if(ped){ // if the ped exists, (if the ID is valid)
            let veh = GetVehiclePedIsIn(ped); // target's vehicle, regardless of if it exists or not
            FreezeEntityPosition(veh, true); // freeze vehicle
            FreezeEntityPosition(ped, true); // freeze ped
            freeze = setInterval(async() => { // begin refreeze process (every 1 second)
                let ped = GetPlayerPed(targetPlayerId); // get the ped again
                let veh = GetVehiclePedIsIn(ped); // get the vehicle again
                if(ped){ // check if the ped exists (if the person is still in the server)
                    await FreezeEntityPosition(veh, true); // refreeze target's vehicle
                    await FreezeEntityPosition(ped, true); // refreeze target's ped
                }else{
                    emitNet('chat:AddMessage', source, { // state in client's chat that the person they froze is no longer in the server
                        args: ['^7[^1Server^7]', `The player you froze (name: ${playerName} | id: ${targetPlayerId}) is no longer in the server. Their freeze has been lifted.`],
                        color: [255, 0, 0]
                    })
                    clearInterval(freeze); // stop the refreeze cycle
                }
            }, 1000);
            emitNet('chat:addMessage', source, { // state in client's chat that the freeze should have happened
                args: ['^7[^1Server^7]', 'That player and/or player\'s vehicle should have frozen!'],
                color: [255, 0, 0]
            })
            console.log(`Player: (name: ${GetPlayerName(targetPlayerId)} | id: ${targetPlayerId}) was frozen by: (name: ${GetPlayerName(source)} | id: ${source})`); // sogs to server's console, contains the frozen player's name & ID, as well as the command runner's name & id.
        }else{
            emitNet('chat:addMessage', source, { // state in client's chat the ID they provided was not attached to any player within the server
                args: ['^7[^1Server^7]', 'No player was found with that ID!'],
                color: [255, 0, 0]
            });
        }
    }else{
        emitNet('chat:addMessage', source, { // state client chat message saying they do not have permission
            args: ['^7[^1Server^7]', 'You do not have permission to use that command!'],
            color: [255, 0, 0]
        })
    }
});

onNet('disky:unfreeze', (targetPlayerId) => {
    if(IsPlayerAceAllowed(source, 'disky.freeze')){ // permissions
        const ped = GetPlayerPed(targetPlayerId); // target's ped
        if(ped){ // if the ped exists, (if the ID is valid)
            const veh = GetVehiclePedIsIn(ped); // target's vehicle, regardless of if it exists or not
            clearInterval(freeze); // stop the refreezing cycle (line 11)
            FreezeEntityPosition(veh, false); // unfreeze vehicle
            FreezeEntityPosition(ped, false); // unfreeze ped
            emitNet('chat:addMessage', source, { // state in client's chat the unfreezing should have happened
                args: ['^7[^1Server^7]', 'That player and/or player\'s vehicle should have unfrozen!'],
                color: [255, 0, 0]
            })
            console.log(`Player: (name: ${GetPlayerName(targetPlayerId)} | id: ${targetPlayerId}) was unfrozen by: (name: ${GetPlayerName(source)} | id: ${source})`); // sogs to server's console, contains the frozen player's name & ID, as well as the command runner's name & id.
        }else{
            emitNet('chat:addMessage', source, { // state in client's chat the ID they provided was not attached to any player within the server
                args: ['^7[^1Server^7]', 'No player was found with that ID!'],
                color: [255, 0, 0]
            })
        }
    }else{
        emitNet('chat:addMessage', source, { // state client chat message saying they do not have permission
            args: ['^7[^1Server^7]', 'You do not have permission to use that command!'],
            color: [255, 0, 0]
        })
    }
});