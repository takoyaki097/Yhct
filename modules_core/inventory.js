/**
 * FILE: modules_core/inventory.js
 * CHỨC NĂNG: Quản lý kho, Logic FEFO, Xử lý lô hạn dùng (Core Logic).
 * THƯ MỤC: modules_core/
 */

window.Inventory = {
    data: [], // Dữ liệu runtime
    dbKey: 'yhct_inventory', // Key lưu trong localForage

    // ============================================================
    // 1. KHỞI TẠO & DỮ LIỆU
    // ============================================================

    // Khởi động module
    init: async function() {
        try {
            const stored = await localforage.getItem(this.dbKey);
            if (stored && Array.isArray(stored)) {
                this.data = stored;
            } else {
                this.data = [];
            }
            console.log("📦 Inventory Loaded:", this.data.length, "items");
            return true;
        } catch (error) {
            console.error("Lỗi khởi tạo kho:", error);
            return false;
        }
    },

    // Lưu dữ liệu xuống ổ cứng
    save: async function() {
        try {
            await localforage.setItem(this.dbKey, this.data);
            // Gửi sự kiện để UI cập nhật nếu cần
            window.dispatchEvent(new CustomEvent('inventory-updated'));
        } catch (error) {
            console.error("Lỗi lưu kho:", error);
            alert("⚠️ Không thể lưu dữ liệu kho! Vui lòng kiểm tra bộ nhớ.");
        }
    },

    // Tạo ID ngẫu nhiên
    generateID: function() {
        return 'inv_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    generateBatchID: function() {
        return 'batch_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    // ============================================================
    // 2. QUẢN LÝ SẢN PHẨM (ITEMS)
    // ============================================================

    /**
     * Thêm sản phẩm mới
     */
    addItem: async function(itemData) {
        const newItem = {
            id: this.generateID(),
            name: itemData.name || "Sản phẩm mới",
            type: itemData.type || "vtyt", // dong_duoc, tan_duoc, vtyt
            unit: itemData.unit || "Cái",
            minStock: parseInt(itemData.minStock) || 5, // Cảnh báo khi tồn dưới mức này
            price: parseInt(itemData.price) || 0,
            batches: [], // Mảng chứa các lô hàng
            totalStock: 0, // Tổng tồn kho (tự động tính)
            lastUpdated: new Date().toISOString()
        };

        this.data.push(newItem);
        await this.save();
        return newItem;
    },

    /**
     * Cập nhật thông tin cơ bản sản phẩm
     */
    updateItem: async function(id, updateData) {
        const index = this.data.findIndex(x => x.id === id);
        if (index === -1) return false;

        this.data[index] = { ...this.data[index], ...updateData, lastUpdated: new Date().toISOString() };
        await this.save();
        return true;
    },

    /**
     * Xóa sản phẩm
     */
    deleteItem: async function(id) {
        if (!confirm("Bạn có chắc muốn xóa mặt hàng này khỏi kho?")) return false;
        this.data = this.data.filter(x => x.id !== id);
        await this.save();
        return true;
    },

    /**
     * Lấy sản phẩm theo ID
     */
    getItem: function(id) {
        return this.data.find(x => x.id === id);
    },
    
    /**
     * Lấy sản phẩm theo Tên (Chính xác hoặc gần đúng)
     */
    findItemByName: function(name) {
        if (!name) return null;
        const normalize = (str) => str.toLowerCase().trim();
        const searchName = normalize(name);
        
        // 1. Tìm chính xác 100%
        let found = this.data.find(x => normalize(x.name) === searchName);
        if (found) return found;

        return null;
    },

    /**
     * Tìm kiếm sản phẩm (cho UI Search)
     */
    search: function(keyword, typeFilter = 'all') {
        const k = keyword.toLowerCase();
        return this.data.filter(item => {
            const matchType = typeFilter === 'all' || item.type === typeFilter;
            const matchName = item.name.toLowerCase().includes(k);
            return matchType && matchName;
        });
    },

    // ============================================================
    // 3. QUẢN LÝ LÔ HÀNG (BATCHES) - NHẬP KHO
    // ============================================================

    addBatch: async function(itemId, batchData) {
        const item = this.getItem(itemId);
        if (!item) return false;

        const newBatch = {
            id: this.generateBatchID(),
            lotNumber: batchData.lotNumber || "LÔ MỚI",
            expiryDate: batchData.expiryDate || "", // YYYY-MM-DD
            quantity: parseInt(batchData.quantity) || 0,
            initialQuantity: parseInt(batchData.quantity) || 0, // Để theo dõi lịch sử
            importPrice: parseInt(batchData.importPrice) || 0,
            importDate: new Date().toISOString()
        };

        if (!item.batches) item.batches = [];
        item.batches.push(newBatch);
        
        // Sắp xếp lô theo hạn sử dụng (FEFO)
        this.sortBatches(item);
        this.recalcTotalStock(item);
        
        await this.save();
        return newBatch;
    },

    updateBatch: async function(itemId, batchId, batchData) {
        const item = this.getItem(itemId);
        if (!item) return false;

        const batchIndex = item.batches.findIndex(b => b.id === batchId);
        if (batchIndex === -1) return false;

        item.batches[batchIndex] = { ...item.batches[batchIndex], ...batchData };
        
        this.sortBatches(item);
        this.recalcTotalStock(item);
        
        await this.save();
        return true;
    },

    deleteBatch: async function(itemId, batchId) {
        const item = this.getItem(itemId);
        if (!item) return false;
        
        item.batches = item.batches.filter(b => b.id !== batchId);
        this.recalcTotalStock(item);
        await this.save();
        return true;
    },

    sortBatches: function(item) {
        if (!item.batches) return;
        item.batches.sort((a, b) => {
            // Nếu không có hạn dùng thì đẩy xuống cuối
            if (!a.expiryDate) return 1;
            if (!b.expiryDate) return -1;
            return new Date(a.expiryDate) - new Date(b.expiryDate);
        });
    },

    recalcTotalStock: function(item) {
        if (!item.batches) item.totalStock = 0;
        else {
            item.totalStock = item.batches.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0);
        }
    },

    // ============================================================
    // 4. LOGIC XUẤT KHO & HOÀN TRẢ (CORE)
    // ============================================================

    /**
     * XUẤT KHO THÔNG MINH (FEFO)
     */
    consumeItem: async function(itemId, amount) {
        const item = this.getItem(itemId);
        if (!item) return null;

        let needed = parseInt(amount);
        if (needed <= 0) return [];

        const transactionLog = [];
        this.sortBatches(item);

        // Duyệt qua từng lô để trừ
        for (let batch of item.batches) {
            if (needed <= 0) break;
            
            let currentQty = batch.quantity;
            if (currentQty <= 0) continue; 

            let deduct = 0;
            if (currentQty >= needed) {
                deduct = needed;
                batch.quantity -= needed;
                needed = 0;
            } else {
                deduct = currentQty;
                batch.quantity = 0;
                needed -= deduct;
            }

            transactionLog.push({
                itemId: itemId,
                batchId: batch.id,
                amount: deduct,
                lotNumber: batch.lotNumber
            });
        }

        // Trường hợp kho thực tế bị thiếu, trừ âm vào lô cuối
        if (needed > 0) {
            let targetBatch;
            if (item.batches.length > 0) {
                targetBatch = item.batches[item.batches.length - 1];
            } else {
                const newBatch = await this.addBatch(itemId, { 
                    lotNumber: "DEFAULT", 
                    quantity: 0,
                    expiryDate: "" 
                });
                targetBatch = item.batches[item.batches.length - 1]; 
            }
            
            targetBatch.quantity -= needed;
            transactionLog.push({
                itemId: itemId,
                batchId: targetBatch.id,
                amount: needed,
                lotNumber: targetBatch.lotNumber
            });
        }

        this.recalcTotalStock(item);
        await this.save();
        return transactionLog;
    },

    /**
     * HOÀN TRẢ KHO
     */
    restoreItems: async function(transactionLogs) {
        if (!transactionLogs || !Array.isArray(transactionLogs) || transactionLogs.length === 0) return;

        let itemsToUpdate = new Set(); 

        for (let log of transactionLogs) {
            const item = this.getItem(log.itemId);
            if (!item) continue;

            itemsToUpdate.add(item.id);

            const batch = item.batches.find(b => b.id === log.batchId);
            if (batch) {
                batch.quantity += log.amount;
            } else {
                console.warn(`Không tìm thấy lô ${log.batchId} để hoàn trả. Cộng vào lô đầu hoặc tạo mới.`);
                if (item.batches.length > 0) {
                    item.batches[0].quantity += log.amount;
                } else {
                    await this.addBatch(item.id, { 
                        lotNumber: "RESTORED", 
                        quantity: log.amount,
                        expiryDate: "" 
                    });
                }
            }
        }

        itemsToUpdate.forEach(itemId => {
            const item = this.getItem(itemId);
            if (item) this.recalcTotalStock(item);
        });

        await this.save();
        console.log("✅ Đã hoàn trả kho.");
    },
    
    /**
     * Cảnh báo tồn kho/Hết hạn
     */
    getWarnings: function(daysThreshold = 90) {
        const lowStock = [];
        const expiring = [];
        const now = new Date();

        this.data.forEach(item => {
            if (item.totalStock <= item.minStock) {
                lowStock.push(item);
            }
            if (item.batches) {
                item.batches.forEach(batch => {
                    if (batch.quantity > 0 && batch.expiryDate) {
                        const expDate = new Date(batch.expiryDate);
                        const diffTime = expDate - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        
                        if (diffDays <= daysThreshold) {
                            expiring.push({
                                itemId: item.id,
                                itemName: item.name,
                                batchId: batch.id,
                                lotNumber: batch.lotNumber,
                                expiryDate: batch.expiryDate,
                                daysLeft: diffDays
                            });
                        }
                    }
                });
            }
        });

        return { lowStock, expiring };
    }
};
