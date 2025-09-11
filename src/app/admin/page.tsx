"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, PlusCircle, Loader2, LogOut, ShieldAlert, Package, ShoppingCart, Check, ChevronsUpDown, Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import type { Order, OrderStatus, Product } from "@/lib/types"
import { getProducts, addProduct, updateProduct, deleteProduct, getAllOrders, updateOrder, deleteOrder } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/auth";
import { format } from "date-fns"


function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Sign Out Error",
          description: "Could not sign out. Please try again.",
        });
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products">
                    <ShoppingCart className="mr-2 h-4 w-4"/>
                    Products
                </TabsTrigger>
                <TabsTrigger value="orders">
                    <Package className="mr-2 h-4 w-4"/>
                    Orders
                </TabsTrigger>
            </TabsList>
            <TabsContent value="products">
                <ProductsTab />
            </TabsContent>
            <TabsContent value="orders">
                <OrdersTab />
            </TabsContent>
        </Tabs>
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imageHint: '',
  });

  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsFromDb = await getProducts();
      setProducts(productsFromDb);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: "Could not load product data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenForm = (product: Product | null) => {
    setSelectedProduct(product);
    setFormData(product ? { ...product } : {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      imageHint: '',
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
        toast({
            variant: "destructive",
            title: "Image address required",
            description: "Please enter an image URL.",
        });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const productData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          imageHint: formData.category.toLowerCase(),
        };

        if (selectedProduct) {
            await updateProduct(selectedProduct.id, productData);
            toast({ title: "Product updated successfully!" });
        } else {
            await addProduct(productData);
            toast({ title: "Product added successfully!" });
        }
        
        await fetchProducts();
        handleCloseForm();
    } catch (error) {
        console.error("Error saving product:", error);
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Could not save the product. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
};

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        toast({ title: "Product deleted successfully" });
        fetchProducts();
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error deleting product",
          description: "Could not delete the product. Please try again.",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    }
  };

    return (
        <Card className="mt-6">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button onClick={() => handleOpenForm(null)}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Product
                </Button>
            </CardHeader>
            <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-1/4" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                    ))
                ) : products.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image}
                        width="64"
                        data-ai-hint={product.imageHint}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell">₦{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenForm(product)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                            className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                            onClick={() => openDeleteDialog(product)}
                            >
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
            </CardContent>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleFormChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={formData.description} onChange={handleFormChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" type="number" step="0.01" value={formData.price} onChange={handleFormChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input id="category" value={formData.category} onChange={handleFormChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Image URL</Label>
                        <Input id="image" placeholder="https://example.com/image.png" value={formData.image} onChange={handleFormChange} className="col-span-3" required />
                    </div>
                    {formData.image && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Preview</Label>
                            <div className="col-span-3">
                            <div className="mt-2 relative w-24 h-24">
                                <Image src={formData.image} alt="Image preview" fill className="rounded-md object-cover" />
                            </div>
                            </div>
                        </div>
                    )}
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {selectedProduct ? 'Save Changes' : 'Add Product'}
                    </Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

const statusOptions: OrderStatus[] = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];

function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const allOrders = await getAllOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({
                variant: "destructive",
                title: "Error fetching orders",
                description: "Could not load order data. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        setIsUpdating(orderId);
        try {
            await updateOrder(orderId, { status });
            toast({ title: "Order status updated successfully!" });
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: "Could not update the order status.",
            });
        } finally {
            setIsUpdating(null);
        }
    };
    
    const openDeleteDialog = (order: Order) => {
        setOrderToDelete(order);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (orderToDelete) {
            try {
                await deleteOrder(orderToDelete.id);
                toast({ title: "Order deleted successfully" });
                fetchOrders();
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error deleting order",
                    description: "Could not delete the order. Please try again.",
                });
            } finally {
                setIsDeleteDialogOpen(false);
                setOrderToDelete(null);
            }
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-500';
            case 'Approved': return 'bg-blue-500';
            case 'Shipped': return 'bg-purple-500';
            case 'Delivered': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }

    return (
        <>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16"/></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full"/></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full"/></TableCell>
                                    </TableRow>
                                ))
                            ) : orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{format(new Date(order.createdAt), 'P')}</TableCell>
                                    <TableCell>₦{order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-32 justify-between" disabled={isUpdating === order.id}>
                                                    {isUpdating === order.id ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                    <>
                                                        <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(order.status)}`}/>
                                                        {order.status}
                                                        <ChevronsUpDown className="h-4 w-4 opacity-50"/>
                                                    </>
                                                    }
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                {statusOptions.map(status => (
                                                    <DropdownMenuItem key={status} onSelect={() => handleStatusChange(order.id, status)}>
                                                        <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(status)}`}/>
                                                        {status}
                                                        {order.status === status && <Check className="ml-auto h-4 w-4"/>}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                {order.paymentProofUrl && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={order.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                                                            <Eye className="mr-2 h-4 w-4" /> View Payment Proof
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                                                onClick={() => openDeleteDialog(order)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the order from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Authorization Wrapper
const ADMIN_UID = "O0dGhZynNgYa6eeZ3r5UDQvRU6h2";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            router.push('/login');
            return;
        }

        const authorized = user.uid === ADMIN_UID;
        setIsAuthorized(authorized);

        if (!authorized) {
            toast({
                variant: 'destructive',
                title: 'Not Authorized',
                description: 'You do not have permission to access the admin dashboard.',
            });
            router.push('/');
        }

    }, [user, loading, router, toast]);

    if (loading || isAuthorized === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthorized) {
       // This will be shown briefly before redirection
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
                <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
                <p className="mt-2 text-muted-foreground">Redirecting...</p>
          </div>
        );
    }

    return <AdminDashboard />;
}
