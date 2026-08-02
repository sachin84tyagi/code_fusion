Welcome to **Chapter 15 — Transactions**.

> **Transactions ensure that a group of operations either ALL succeed or ALL fail. This is how banks prevent money from disappearing during transfers.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine transferring money from your bank account to a friend.

Two things must happen:

```
Step 1: Deduct ₹1000 from YOUR account

Step 2: Add ₹1000 to FRIEND's account
```

Now imagine Step 1 succeeds.

But the app crashes before Step 2.

```
❌ You lost ₹1000
❌ Friend got nothing
```

That's a disaster.

A **Transaction** wraps both steps.

If Step 2 fails → Step 1 is automatically reversed.

Either both succeed or neither does.

---

# What is a Transaction?

A Transaction is a group of database operations that are treated as a **single atomic unit**.

Properties (ACID):

```
A → Atomicity     (all or nothing)
C → Consistency   (data stays valid)
I → Isolation     (concurrent transactions don't interfere)
D → Durability    (committed data survives crashes)
```

---

# MongoDB Transactions Requirement

Transactions require a **Replica Set** or **Sharded Cluster**.

Local MongoDB single instance → no transactions.

MongoDB Atlas → Transactions work automatically.

---

# Basic Transaction Pattern

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
    // All operations inside the session
    await Operation1.create([data], { session });
    await Operation2.updateOne(filter, update, { session });

    // Commit if all succeed
    await session.commitTransaction();

} catch (error) {
    // Rollback if anything fails
    await session.abortTransaction();
    throw error;

} finally {
    session.endSession();
}
```

---

# Real Example — Bank Transfer

```javascript
const transferMoney = async (senderId, receiverId, amount) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Deduct from sender
        const sender = await Account.findById(senderId).session(session);

        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        await Account.updateOne(
            { _id: senderId },
            { $inc: { balance: -amount } },
            { session }
        );

        // Add to receiver
        await Account.updateOne(
            { _id: receiverId },
            { $inc: { balance: amount } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();

        return { success: true, message: "Transfer complete" };

    } catch (error) {
        // Rollback everything
        await session.abortTransaction();
        throw error;

    } finally {
        session.endSession();
    }
};
```

If the receiver doesn't exist → sender's balance is restored.

---

# E-commerce Order Transaction

```javascript
const placeOrder = async (userId, items, paymentData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Create order
        const [order] = await Order.create([{
            userId,
            items,
            status: "pending",
            total: calculateTotal(items)
        }], { session });

        // 2. Reduce inventory
        for (const item of items) {
            const result = await Product.updateOne(
                { _id: item.productId, stock: { $gte: item.qty } },
                { $inc: { stock: -item.qty } },
                { session }
            );

            if (result.modifiedCount === 0) {
                throw new Error(`${item.name} is out of stock`);
            }
        }

        // 3. Create payment record
        await Payment.create([{
            orderId: order._id,
            ...paymentData,
            status: "completed"
        }], { session });

        // All good — commit
        await session.commitTransaction();

        return order;

    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        session.endSession();
    }
};
```

If inventory update fails → order is NOT created, payment is NOT recorded.

---

# Transaction with Express Route

```javascript
app.post("/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { toUserId, amount } = req.body;

        await Account.updateOne(
            { userId: req.user.id, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.updateOne(
            { userId: toUserId },
            { $inc: { balance: amount } },
            { session }
        );

        await session.commitTransaction();

        res.json({ message: "Transfer successful" });

    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ error: err.message });

    } finally {
        session.endSession();
    }
});
```

---

# withTransaction Helper (Cleaner)

Mongoose provides a convenience wrapper.

```javascript
const session = await mongoose.startSession();

await session.withTransaction(async () => {
    await Account.updateOne(
        { _id: senderId },
        { $inc: { balance: -amount } },
        { session }
    );

    await Account.updateOne(
        { _id: receiverId },
        { $inc: { balance: amount } },
        { session }
    );
});

session.endSession();
```

Automatically commits on success, aborts on error.

---

# Company Example — Booking Platform

MakeMyTrip flight booking:

```
Transaction:

  Step 1: Lock the seat (mark as reserved)

  Step 2: Create booking record

  Step 3: Deduct from user wallet

  Step 4: Mark seat as confirmed

If any step fails → All steps reversed → Seat available again
```

---

# Interview Questions

## Q1. What is a MongoDB transaction?

**Best Answer**

> A MongoDB transaction is a group of database operations treated as a single atomic unit. Either all operations succeed (commit) or all are rolled back (abort), ensuring data consistency across multiple documents or collections.

---

## Q2. What does ACID stand for?

**A**tomicity, **C**onsistency, **I**solation, **D**urability.

---

## Q3. What is required to use transactions in MongoDB?

A Replica Set or Sharded Cluster. (MongoDB Atlas provides this automatically.)

---

## Q4. What is `session.abortTransaction()`?

It rolls back all operations done within the session, reverting the database to its state before the transaction started.

---

## Q5. What is `withTransaction()`?

A Mongoose helper that automatically handles commit and abort — cleaner than manual try/catch.

---

# Professional Summary

```
const session = await mongoose.startSession();
session.startTransaction();

try {
    await Op1({ session });
    await Op2({ session });
    await session.commitTransaction();
} catch {
    await session.abortTransaction();
    throw error;
} finally {
    session.endSession();
}

Rule: All operations must receive { session }
```

---

# 🧠 Memory Trick

```
Transaction = Double-entry bookkeeping

Debit Account A: -₹1000
Credit Account B: +₹1000

Both happen or neither happens.
No money disappears.
```

---

# 🚀 Next Chapter

We'll learn **Sharding** — how MongoDB scales horizontally to handle billions of documents across multiple servers.
