import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.tax_rates import Tax_ratesService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/tax_rates", tags=["tax_rates"])


# ---------- Pydantic Schemas ----------
class Tax_ratesData(BaseModel):
    """Entity data schema (for create/update)"""
    name: str
    rate: float
    description: str = None
    is_active: bool = None
    created_at: str = None


class Tax_ratesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    name: Optional[str] = None
    rate: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    created_at: Optional[str] = None


class Tax_ratesResponse(BaseModel):
    """Entity response schema"""
    id: int
    name: str
    rate: float
    description: Optional[str] = None
    is_active: Optional[bool] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class Tax_ratesListResponse(BaseModel):
    """List response schema"""
    items: List[Tax_ratesResponse]
    total: int
    skip: int
    limit: int


class Tax_ratesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Tax_ratesData]


class Tax_ratesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Tax_ratesUpdateData


class Tax_ratesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Tax_ratesBatchUpdateItem]


class Tax_ratesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Tax_ratesListResponse)
async def query_tax_ratess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query tax_ratess with filtering, sorting, and pagination"""
    logger.debug(f"Querying tax_ratess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Tax_ratesService(db)
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
        )
        logger.debug(f"Found {result['total']} tax_ratess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying tax_ratess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Tax_ratesListResponse)
async def query_tax_ratess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query tax_ratess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying tax_ratess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Tax_ratesService(db)
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
        logger.debug(f"Found {result['total']} tax_ratess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying tax_ratess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Tax_ratesResponse)
async def get_tax_rates(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single tax_rates by ID"""
    logger.debug(f"Fetching tax_rates with id: {id}, fields={fields}")
    
    service = Tax_ratesService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Tax_rates with id {id} not found")
            raise HTTPException(status_code=404, detail="Tax_rates not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching tax_rates {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Tax_ratesResponse, status_code=201)
async def create_tax_rates(
    data: Tax_ratesData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new tax_rates"""
    logger.debug(f"Creating new tax_rates with data: {data}")
    
    service = Tax_ratesService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create tax_rates")
        
        logger.info(f"Tax_rates created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating tax_rates: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating tax_rates: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Tax_ratesResponse], status_code=201)
async def create_tax_ratess_batch(
    request: Tax_ratesBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple tax_ratess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} tax_ratess")
    
    service = Tax_ratesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} tax_ratess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Tax_ratesResponse])
async def update_tax_ratess_batch(
    request: Tax_ratesBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple tax_ratess in a single request"""
    logger.debug(f"Batch updating {len(request.items)} tax_ratess")
    
    service = Tax_ratesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} tax_ratess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Tax_ratesResponse)
async def update_tax_rates(
    id: int,
    data: Tax_ratesUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing tax_rates"""
    logger.debug(f"Updating tax_rates {id} with data: {data}")

    service = Tax_ratesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Tax_rates with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Tax_rates not found")
        
        logger.info(f"Tax_rates {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating tax_rates {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating tax_rates {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_tax_ratess_batch(
    request: Tax_ratesBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple tax_ratess by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} tax_ratess")
    
    service = Tax_ratesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} tax_ratess successfully")
        return {"message": f"Successfully deleted {deleted_count} tax_ratess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_tax_rates(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single tax_rates by ID"""
    logger.debug(f"Deleting tax_rates with id: {id}")
    
    service = Tax_ratesService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Tax_rates with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Tax_rates not found")
        
        logger.info(f"Tax_rates {id} deleted successfully")
        return {"message": "Tax_rates deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting tax_rates {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")