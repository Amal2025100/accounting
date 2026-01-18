"""
API endpoint for database seeding
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import asyncio
import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from core.database import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

router = APIRouter(prefix="/api/v1/seed", tags=["seed"])


class SeedResponse(BaseModel):
    success: bool
    message: str
    details: dict


@router.post("/reset-demo-data", response_model=SeedResponse)
async def reset_demo_data(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Reset and reload demo data for testing purposes.
    This will clear all existing data and populate with fresh sample data.
    
    **Warning**: This will delete all existing data!
    """
    try:
        # Import seeding functions
        from seed_database import (
            clear_all_data,
            seed_payment_methods,
            seed_products,
            seed_customers,
            seed_employees,
            seed_suppliers,
            seed_sales_transactions,
            seed_purchase_orders,
        )
        
        # Use current user ID for seeding
        user_id = current_user.id
        
        # Clear existing data
        await clear_all_data(db)
        
        # Seed data in order
        await seed_payment_methods(db, user_id)
        await seed_products(db, user_id)
        await seed_customers(db, user_id)
        await seed_employees(db, user_id)
        await seed_suppliers(db, user_id)
        await seed_sales_transactions(db, user_id)
        await seed_purchase_orders(db, user_id)
        
        return SeedResponse(
            success=True,
            message="Demo data reset successfully",
            details={
                "products": 30,
                "customers": 15,
                "employees": 10,
                "suppliers": 8,
                "sales": 50,
                "purchase_orders": 15,
                "payment_methods": 4,
            }
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reset demo data: {str(e)}"
        )


@router.get("/status")
async def get_seed_status(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get current database data counts
    """
    from sqlalchemy import text
    
    try:
        tables = [
            'products', 'customers', 'employees', 'suppliers',
            'sales', 'purchase_orders', 'payment_methods'
        ]
        
        counts = {}
        for table in tables:
            result = await db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            counts[table] = result.scalar()
        
        return {
            "success": True,
            "counts": counts,
            "has_data": any(count > 0 for count in counts.values())
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get seed status: {str(e)}"
        )