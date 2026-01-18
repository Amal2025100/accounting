import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.sale_items import Sale_itemsService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/sale_items", tags=["sale_items"])


# ---------- Pydantic Schemas ----------
class Sale_itemsData(BaseModel):
    """Entity data schema (for create/update)"""
    sale_id: int
    product_id: int
    product_name: str
    quantity: int
    price: float


class Sale_itemsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    sale_id: Optional[int] = None
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None


class Sale_itemsResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    sale_id: int
    product_id: int
    product_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class Sale_itemsListResponse(BaseModel):
    """List response schema"""
    items: List[Sale_itemsResponse]
    total: int
    skip: int
    limit: int


class Sale_itemsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Sale_itemsData]


class Sale_itemsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Sale_itemsUpdateData


class Sale_itemsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Sale_itemsBatchUpdateItem]


class Sale_itemsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Sale_itemsListResponse)
async def query_sale_itemss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query sale_itemss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying sale_itemss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Sale_itemsService(db)
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
        logger.debug(f"Found {result['total']} sale_itemss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying sale_itemss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Sale_itemsListResponse)
async def query_sale_itemss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query sale_itemss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying sale_itemss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Sale_itemsService(db)
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
        logger.debug(f"Found {result['total']} sale_itemss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying sale_itemss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Sale_itemsResponse)
async def get_sale_items(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single sale_items by ID (user can only see their own records)"""
    logger.debug(f"Fetching sale_items with id: {id}, fields={fields}")
    
    service = Sale_itemsService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Sale_items with id {id} not found")
            raise HTTPException(status_code=404, detail="Sale_items not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sale_items {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Sale_itemsResponse, status_code=201)
async def create_sale_items(
    data: Sale_itemsData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new sale_items"""
    logger.debug(f"Creating new sale_items with data: {data}")
    
    service = Sale_itemsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create sale_items")
        
        logger.info(f"Sale_items created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating sale_items: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating sale_items: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Sale_itemsResponse], status_code=201)
async def create_sale_itemss_batch(
    request: Sale_itemsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple sale_itemss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} sale_itemss")
    
    service = Sale_itemsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} sale_itemss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Sale_itemsResponse])
async def update_sale_itemss_batch(
    request: Sale_itemsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple sale_itemss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} sale_itemss")
    
    service = Sale_itemsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} sale_itemss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Sale_itemsResponse)
async def update_sale_items(
    id: int,
    data: Sale_itemsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing sale_items (requires ownership)"""
    logger.debug(f"Updating sale_items {id} with data: {data}")

    service = Sale_itemsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Sale_items with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Sale_items not found")
        
        logger.info(f"Sale_items {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating sale_items {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating sale_items {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_sale_itemss_batch(
    request: Sale_itemsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple sale_itemss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} sale_itemss")
    
    service = Sale_itemsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} sale_itemss successfully")
        return {"message": f"Successfully deleted {deleted_count} sale_itemss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_sale_items(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single sale_items by ID (requires ownership)"""
    logger.debug(f"Deleting sale_items with id: {id}")
    
    service = Sale_itemsService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Sale_items with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Sale_items not found")
        
        logger.info(f"Sale_items {id} deleted successfully")
        return {"message": "Sale_items deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sale_items {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")