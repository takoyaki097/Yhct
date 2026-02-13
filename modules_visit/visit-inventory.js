/**
 * FILE: modules_visit/visit-inventory.js
 * CHUC NANG: Xu ly logic Tru kho & Hoan tra kho (FEFO)
 */

// Ham tinh toan va tru kho khi luu phieu kham
window.processInventoryConsumption = async function(visitData, oldVisitData) {
    if (!window.Inventory) return [];
    
    let newLogs = [];

    // 1. Hoan tra kho cu (neu dang sua phieu cu)
    if (oldVisitData && oldVisitData.inventoryLogs) {
        console.log("🔄 Đang hoàn trả kho cho đơn cũ...");
        await window.Inventory.restoreItems(oldVisitData.inventoryLogs);
    }

    // 2. Tinh toan luong tru moi
    // A. Thuoc Dong Y (Gam * So thang)
    const eastDays = visitData.eastDays || 1;
    if (visitData.rxEast && visitData.rxEast.length > 0) {
        for (let med of visitData.rxEast) {
            const invItem = window.Inventory.findItemByName(med.name);
            if (invItem) {
                const amount = (med.qty || 0) * eastDays;
                if(amount > 0) {
                    const logs = await window.Inventory.consumeItem(invItem.id, amount);
                    if(logs) newLogs = newLogs.concat(logs);
                }
            }
        }
    }
    
    // B. Thuoc Tay Y (Tong vien)
    if (visitData.rxWest && visitData.rxWest.length > 0) {
        for (let med of visitData.rxWest) {
            const invItem = window.Inventory.findItemByName(med.name);
            if (invItem) {
                const amount = med.qty || 0; 
                if(amount > 0) {
                    const logs = await window.Inventory.consumeItem(invItem.id, amount);
                    if(logs) newLogs = newLogs.concat(logs);
                }
            }
        }
    }

    // C. Vat tu Thu thuat
    if (visitData.procs && visitData.procs.length > 0) {
        for (let proc of visitData.procs) {
            if (proc.consumables && proc.consumables.itemId && proc.consumables.totalDeduct > 0) {
                 const logs = await window.Inventory.consumeItem(proc.consumables.itemId, proc.consumables.totalDeduct);
                 if(logs) newLogs = newLogs.concat(logs);
            }
        }
    }

    return newLogs;
};

// Ham Hoan tra kho (Dung khi Xoa phieu kham)
window.restoreInventoryFromVisit = async function(visitData) {
    if (visitData && visitData.inventoryLogs && window.Inventory) {
        await window.Inventory.restoreItems(visitData.inventoryLogs);
        console.log("✅ Đã hoàn trả kho từ phiếu khám.");
    }
};
