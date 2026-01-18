import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.stock_adjustments import Stock_adjustmentsService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/stock_adjustments", tags=["stock_adjustments"])


# ---------- Pydantic Schemas ----------
class Stock_adjustmentsData(BaseModel):
    """Entity data schema (for create/update)"""
    product_id: int
    product_name: str = None
    adjustment_type: str
    quantity: int
    reason: str = None
    adjusted_by: str = None
    adjustment_date: str
    created_at: str = None


class Stock_adjustmentsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    adjustment_type: Optional[str] = None
    quantity: Optional[int] = None
    reason: Optional[str] = None
    adjusted_by: Optional[str] = None
    adjustment_date: Optional[str] = None
    created_at: Optional[str] = None


class Stock_adjustmentsResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    product_id: int
    product_name: Optional[str] = None
    adjustment_type: str
    quantity: int
    reason: Optional[str] = None
    adjusted_by: Optional[str] = None
    adjustment_date: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class Stock_adjustmentsListResponse(BaseModel):
    """List response schema"""
    items: List[Stock_adjustmentsResponse]
    total: int
    skip: int
    limit: int


class Stock_adjustmentsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Stock_adjustmentsData]


class Stock_adjustmentsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Stock_adjustmentsUpdateData


class Stock_adjustmentsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Stock_adjustmentsBatchUpdateItem]


class Stock_adjustmentsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Stock_adjustmentsListResponse)
async def query_stock_adjustmentss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query stock_adjustmentss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying stock_adjustmentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Stock_adjustmentsService(db)
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
        logger.debug(f"Found {result['total']} stock_adjustmentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying stock_adjustmentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Stock_adjustmentsListResponse)
async def query_stock_adjustmentss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query stock_adjustmentss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying stock_adjustmentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Stock_adjustmentsService(db)
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
        logger.debug(f"Found {result['total']} stock_adjustmentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying stock_adjustmentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Stock_adjustmentsResponse)
async def get_stock_adjustments(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single stock_adjustments by ID (user can only see their own records)"""
    logger.debug(f"Fetching stock_adjustments with id: {id}, fields={fields}")
    
    service = Stock_adjustmentsService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Stock_adjustments with id {id} not found")
            raise HTTPException(status_code=404, detail="Stock_adjustments not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching stock_adjustments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Stock_adjustmentsResponse, status_code=201)
async def create_stock_adjustments(
    data: Stock_adjustmentsData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new stock_adjustments"""
    logger.debug(f"Creating new stock_adjustments with data: {data}")
    
    service = Stock_adjustmentsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create stock_adjustments")
        
        logger.info(f"Stock_adjustments created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating stock_adjustments: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating stock_adjustments: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Stock_adjustmentsResponse], status_code=201)
async def create_stock_adjustmentss_batch(
    request: Stock_adjustmentsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple stock_adjustmentss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} stock_adjustmentss")
    
    service = Stock_adjustmentsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} stock_adjustmentss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Stock_adjustmentsResponse])
async def update_stock_adjustmentss_batch(
    request: Stock_adjustmentsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple stock_adjustmentss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} stock_adjustmentss")
    
    service = Stock_adjustmentsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} stock_adjustmentss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Stock_adjustmentsResponse)
async def update_stock_adjustments(
    id: int,
    data: Stock_adjustmentsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing stock_adjustments (requires ownership)"""
    logger.debug(f"Updating stock_adjustments {id} with data: {data}")

    service = Stock_adjustmentsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Stock_adjustments with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Stock_adjustments not found")
        
        logger.info(f"Stock_adjustments {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating stock_adjustments {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating stock_adjustments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_stock_adjustmentss_batch(
    request: Stock_adjustmentsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple stock_adjustmentss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} stock_adjustmentss")
    
    service = Stock_adjustmentsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} stock_adjustmentss successfully")
        return {"message": f"Successfully deleted {deleted_count} stock_adjustmentss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_stock_adjustments(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single stock_adjustments by ID (requires ownership)"""
    logger.debug(f"Deleting stock_adjustments with id: {id}")
    
    service = Stock_adjustmentsService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Stock_adjustments with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Stock_adjustments not found")
        
        logger.info(f"Stock_adjustments {id} deleted successfully")
        return {"message": "Stock_adjustments deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting stock_adjustments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")