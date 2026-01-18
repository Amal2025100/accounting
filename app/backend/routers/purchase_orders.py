import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.purchase_orders import Purchase_ordersService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/purchase_orders", tags=["purchase_orders"])


# ---------- Pydantic Schemas ----------
class Purchase_ordersData(BaseModel):
    """Entity data schema (for create/update)"""
    po_number: str
    supplier_id: int
    supplier_name: str = None
    order_date: str
    expected_delivery: str = None
    total_amount: float
    status: str = None
    created_by: str = None
    created_at: str = None


class Purchase_ordersUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    po_number: Optional[str] = None
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None
    order_date: Optional[str] = None
    expected_delivery: Optional[str] = None
    total_amount: Optional[float] = None
    status: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None


class Purchase_ordersResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    po_number: str
    supplier_id: int
    supplier_name: Optional[str] = None
    order_date: str
    expected_delivery: Optional[str] = None
    total_amount: float
    status: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class Purchase_ordersListResponse(BaseModel):
    """List response schema"""
    items: List[Purchase_ordersResponse]
    total: int
    skip: int
    limit: int


class Purchase_ordersBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Purchase_ordersData]


class Purchase_ordersBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Purchase_ordersUpdateData


class Purchase_ordersBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Purchase_ordersBatchUpdateItem]


class Purchase_ordersBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Purchase_ordersListResponse)
async def query_purchase_orderss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query purchase_orderss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying purchase_orderss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Purchase_ordersService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
            user_id=str(current_user.id),
        )
        logger.debug(f"Found {result['total']} purchase_orderss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying purchase_orderss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Purchase_ordersListResponse)
async def query_purchase_orderss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query purchase_orderss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying purchase_orderss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Purchase_ordersService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} purchase_orderss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying purchase_orderss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Purchase_ordersResponse)
async def get_purchase_orders(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single purchase_orders by ID (user can only see their own records)"""
    logger.debug(f"Fetching purchase_orders with id: {id}, fields={fields}")
    
    service = Purchase_ordersService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Purchase_orders with id {id} not found")
            raise HTTPException(status_code=404, detail="Purchase_orders not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching purchase_orders {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Purchase_ordersResponse, status_code=201)
async def create_purchase_orders(
    data: Purchase_ordersData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new purchase_orders"""
    logger.debug(f"Creating new purchase_orders with data: {data}")
    
    service = Purchase_ordersService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create purchase_orders")
        
        logger.info(f"Purchase_orders created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating purchase_orders: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating purchase_orders: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Purchase_ordersResponse], status_code=201)
async def create_purchase_orderss_batch(
    request: Purchase_ordersBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple purchase_orderss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} purchase_orderss")
    
    service = Purchase_ordersService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} purchase_orderss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Purchase_ordersResponse])
async def update_purchase_orderss_batch(
    request: Purchase_ordersBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple purchase_orderss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} purchase_orderss")
    
    service = Purchase_ordersService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} purchase_orderss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Purchase_ordersResponse)
async def update_purchase_orders(
    id: int,
    data: Purchase_ordersUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing purchase_orders (requires ownership)"""
    logger.debug(f"Updating purchase_orders {id} with data: {data}")

    service = Purchase_ordersService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Purchase_orders with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Purchase_orders not found")
        
        logger.info(f"Purchase_orders {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating purchase_orders {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating purchase_orders {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_purchase_orderss_batch(
    request: Purchase_ordersBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple purchase_orderss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} purchase_orderss")
    
    service = Purchase_ordersService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} purchase_orderss successfully")
        return {"message": f"Successfully deleted {deleted_count} purchase_orderss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_purchase_orders(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single purchase_orders by ID (requires ownership)"""
    logger.debug(f"Deleting purchase_orders with id: {id}")
    
    service = Purchase_ordersService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Purchase_orders with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Purchase_orders not found")
        
        logger.info(f"Purchase_orders {id} deleted successfully")
        return {"message": "Purchase_orders deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting purchase_orders {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")